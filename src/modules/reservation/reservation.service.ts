import sequelize from '../../database/sequelize';
import { Transaction } from 'sequelize';
import ReservationRepository from './reservation.repository';
import DropRepository from '../drop/drop.repository';
import Reservation from './reservation.model';
import Drop from '../drop/drop.model';
import { ReservationStatus } from './reservation.interface';
import { SocketService } from '../../socket';
import { EVENTS } from '../../socket/events';

/**
 * ReservationService - contains ALL business logic related to Reservations.
 *
 * Business rules enforced here:
 * - One user can only have ONE ACTIVE reservation for the same Drop
 * - Reservation duration is exactly 60 seconds
 * - expiresAt = createdAt + 60 seconds
 * - Reservation decreases availableStock immediately
 * - If availableStock == 0, reservation must fail
 *
 * The critical operation (createReservation) is ATOMIC:
 * - Uses a PostgreSQL transaction
 * - Locks the Drop row with FOR UPDATE
 * - All checks and updates happen inside the transaction
 * - Rollback on any failure
 *
 * This layer:
 * - Coordinates repositories for data access
 * - Contains ALL business rules
 * - Does NOT know anything about Express (no req/res)
 * - Can be tested independently of the HTTP layer
 */
class ReservationService {
  private reservationRepository: ReservationRepository;
  private dropRepository: DropRepository;
  private socketService: SocketService;

  constructor() {
    this.reservationRepository = new ReservationRepository();
    this.dropRepository = new DropRepository();
    this.socketService = new SocketService(undefined as any); // Will be set after initialization
  }

  /**
   * Set the socket service instance.
   * Called after Socket.IO is initialized in server.ts.
   */
  setSocketService(socketService: SocketService): void {
    this.socketService = socketService;
  }

  /**
   * Create a reservation atomically.
   *
   * The entire operation (check stock → check existing reservation →
   * decrement stock → create reservation) happens inside ONE PostgreSQL
   * transaction with row-level locking to prevent race conditions.
   *
   * @throws Error if stock is insufficient or user already has an active reservation
   */
  async createReservation(userId: number, dropId: number): Promise<Reservation> {
    return sequelize.transaction(async (transaction: Transaction) => {
      // Step 1: Lock the Drop row with FOR UPDATE
      // This prevents concurrent requests from reading stale availableStock
      const drop = await Drop.findByPk(dropId, {
        transaction,
        lock: Transaction.LOCK.UPDATE,
      });

      if (!drop) {
        throw new Error('Drop not found');
      }

      const now = new Date();

      // Step 2: Check if drop has started
      if (drop.startsAt > now) {
        throw new Error('drop is not started');
      }

      // Step 3: Check available stock
      if (drop.availableStock <= 0) {
        throw new Error('No available stock for this drop');
      }

      // Step 4: Check if user already has an ACTIVE reservation for this drop
      const existingReservation = await this.reservationRepository.findActiveByUserAndDrop(
        userId,
        dropId,
        { transaction }
      );

      if (existingReservation) {
        throw new Error('You already have an active reservation for this drop');
      }

      // Step 5: Decrease availableStock
      drop.availableStock -= 1;
      await drop.save({ transaction });

      // Step 6: Calculate expiresAt (60 seconds from now)
      const expiresAt = new Date(now.getTime() + 60000);

      // Step 6: Create the reservation
      const reservation = await this.reservationRepository.create(
        {
          userId,
          dropId,
          status: ReservationStatus.ACTIVE,
          expiresAt,
        },
        { transaction }
      );

      // Transaction commits automatically on success

      // Broadcast stock update to all connected clients
      this.socketService.broadcast(EVENTS.DROP.STOCK_UPDATED, {
        dropId: drop.id,
        availableStock: drop.availableStock,
      });

      return reservation;
    });
  }

  /**
   * Get all reservations from the database.
   */
  async getReservations(): Promise<Reservation[]> {
    return this.reservationRepository.findAll();
  }

  /**
   * Get all ACTIVE reservations for a specific user.
   */
  async getActiveReservationsByUser(userId: number): Promise<Reservation[]> {
    return this.reservationRepository.findActiveByUserId(userId);
  }

  /**
   * Get a single reservation by its ID.
   */
  async getReservation(id: number): Promise<Reservation | null> {
    return this.reservationRepository.findById(id);
  }
}

export default ReservationService;
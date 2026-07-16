import sequelize from '../../database/sequelize';
import { Transaction } from 'sequelize';
import PurchaseRepository from './purchase.repository';
import ReservationRepository from '../reservation/reservation.repository';
import User from '../user/user.model';
import Drop from '../drop/drop.model';
import Purchase from './purchase.model';
import Reservation from '../reservation/reservation.model';
import { ReservationStatus } from '../reservation/reservation.interface';
import { EVENTS } from '../../socket';
import type { SocketService } from '../../socket';
import type { ActivityUpdatedPayload } from '../../socket/types';

/**
 * PurchaseService - contains ALL business logic related to Purchases.
 *
 * Business rules enforced here:
 * - Purchase can only be created from an ACTIVE reservation
 * - Reservation must belong to the requesting user
 * - Reservation must not be expired (expiresAt > now)
 * - Reservation status becomes PURCHASED after successful purchase
 * - availableStock is NOT modified during purchase (already decremented at reservation)
 *
 * After a successful purchase, broadcasts ACTIVITY.UPDATED to all connected
 * clients so the activity feed can be updated in real time.
 *
 * The critical operation (createPurchase) is ATOMIC:
 * - Uses a PostgreSQL transaction
 * - Locks the Reservation row with FOR UPDATE
 * - All checks and updates happen inside the transaction
 * - Rollback on any failure
 * - Socket event is ONLY emitted AFTER the transaction commits
 *
 * This layer:
 * - Coordinates repositories for data access
 * - Contains ALL business rules
 * - Does NOT know anything about Express (no req/res)
 * - Can be tested independently of the HTTP layer
 */
class PurchaseService {
  private purchaseRepository: PurchaseRepository;
  private reservationRepository: ReservationRepository;
  private socketService: SocketService;

  constructor(socketService: SocketService) {
    this.purchaseRepository = new PurchaseRepository();
    this.reservationRepository = new ReservationRepository();
    this.socketService = socketService;
  }

  /**
   * Create a purchase from an active reservation atomically.
   *
   * The entire operation (find reservation → validate → create purchase →
   * update reservation status) happens inside ONE PostgreSQL transaction
   * with row-level locking to prevent race conditions.
   *
   * AFTER the transaction commits successfully, broadcasts ACTIVITY.UPDATED
   * to all connected clients with the complete payload needed for the
   * frontend to render the new activity item immediately.
   *
   * @throws Error if reservation is not found, does not belong to user,
   *               is not active, or has expired
   */
  async createPurchase(userId: number, dropId: number, reservationId: number): Promise<Purchase> {
    const purchase = await sequelize.transaction(async (transaction: Transaction) => {
      // Step 1: Find and lock the Reservation row with FOR UPDATE
      const reservation = await Reservation.findByPk(reservationId, {
        transaction,
        lock: Transaction.LOCK.UPDATE,
      });

      // Step 2: Validate reservation exists
      if (!reservation) {
        throw new Error('Reservation not found');
      }

      // Step 3: Validate reservation belongs to the requesting user
      if (reservation.userId !== userId) {
        throw new Error('Reservation does not belong to this user');
      }

      // Step 4: Validate reservation status is ACTIVE
      if (reservation.status !== ReservationStatus.ACTIVE) {
        throw new Error('Reservation is not active');
      }

      // Step 5: Validate reservation has not expired
      const now = new Date();
      if (reservation.expiresAt < now) {
        throw new Error('Reservation has expired');
      }

      // Step 6: Create the purchase
      const purchase = await this.purchaseRepository.create(
        {
          userId,
          dropId,
          reservationId,
        },
        { transaction }
      );

      // Step 7: Update reservation status to PURCHASED
      reservation.status = ReservationStatus.PURCHASED;
      await reservation.save({ transaction });

      // Transaction commits automatically on success
      return purchase;
    });

    // Socket event is ONLY emitted AFTER the transaction commits.
    // Fetch related data here so the payload is complete for the frontend.
    const [user, drop] = await Promise.all([
      User.findByPk(userId, { attributes: ['username'] }),
      Drop.findByPk(dropId, { attributes: ['name'] }),
    ]);

    const activityPayload: ActivityUpdatedPayload = {
      purchaseId: purchase.id,
      username: user?.username ?? '',
      dropId: drop?.id ?? dropId,
      dropName: drop?.name ?? '',
      purchasedAt: purchase.createdAt.toISOString(),
    };

    this.socketService.broadcast(EVENTS.ACTIVITY.UPDATED, activityPayload);

    return purchase;
  }

  /**
   * Get all purchases from the database.
   */
  async getPurchases(): Promise<Purchase[]> {
    return this.purchaseRepository.findAll();
  }

  /**
   * Get a single purchase by its ID.
   */
  async getPurchase(id: number): Promise<Purchase | null> {
    return this.purchaseRepository.findById(id);
  }
}

export default PurchaseService;
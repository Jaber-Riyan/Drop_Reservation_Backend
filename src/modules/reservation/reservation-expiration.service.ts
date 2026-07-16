import sequelize from '../../database/sequelize';
import { Transaction } from 'sequelize';
import ReservationRepository from '../reservation/reservation.repository';
import DropRepository from '../drop/drop.repository';
import Reservation from '../reservation/reservation.model';
import Drop from '../drop/drop.model';
import { ReservationStatus } from '../reservation/reservation.interface';
import { EVENTS } from '../../socket';
import type { SocketService } from '../../socket';
import type { ReservationExpiredPayload, StockUpdatedPayload } from '../../socket/types';

/**
 * ReservationExpirationService - handles automatic expiration of reservations.
 *
 * Business rules:
 * - Only ACTIVE reservations where expiresAt <= NOW() are processed
 * - PURCHASED reservations are NEVER touched
 * - Each expiration is atomic: the reservation becomes EXPIRED and the
 *   related drop's availableStock is restored by exactly 1
 *
 * Socket.IO events:
 * - Emits RESERVATION.EXPIRED to the reservation owner
 * - Emits DROP.STOCK_UPDATED to all connected clients
 *
 * This service is called by the cron job. It contains NO knowledge of cron
 * or Express.
 */
class ReservationExpirationService {
  private reservationRepository: ReservationRepository;
  private dropRepository: DropRepository;
  private socketService: SocketService;

  constructor(socketService: SocketService) {
    this.reservationRepository = new ReservationRepository();
    this.dropRepository = new DropRepository();
    this.socketService = socketService;
  }

  /**
   * Find all expired ACTIVE reservations and process them one by one.
   *
   * Entry point called by the cron job. Each reservation is processed in
   * its own database transaction so that the status update and stock
   * restoration either both succeed or both roll back.
   */
  async processExpiredReservations(): Promise<void> {
    const expiredReservations = await this.reservationRepository.findExpiredActiveReservations();

    for (const reservation of expiredReservations) {
      await this.expireReservation(reservation);
    }
  }

  /**
   * Expire a single reservation atomically.
   *
   * Flow:
   * 1. Begin transaction
   * 2. Lock the Reservation row (FOR UPDATE) and confirm it is still ACTIVE
   * 3. Lock the related Drop row (FOR UPDATE)
   * 4. Update reservation status: ACTIVE -> EXPIRED
   * 5. Increase drop.availableStock by 1
   * 6. Commit transaction
   *
   * If any step fails, the entire transaction is rolled back.
   */
  private async expireReservation(reservation: Reservation): Promise<void> {
    return sequelize.transaction(async (transaction: Transaction) => {
      // Lock the Reservation row and re-check status to handle
      // concurrent purchases that may have already claimed it.
      const lockedReservation = await Reservation.findByPk(reservation.id, {
        transaction,
        lock: Transaction.LOCK.UPDATE,
      });

      if (!lockedReservation) {
        return;
      }

      // Skip if the reservation is no longer ACTIVE (e.g. PURCHASED)
      if (lockedReservation.status !== ReservationStatus.ACTIVE) {
        return;
      }

      // Lock the Drop row to prevent concurrent stock modifications
      const drop = await this.dropRepository.lockById(lockedReservation.dropId, transaction);
      if (!drop) {
        return;
      }

      // Update reservation status to EXPIRED
      await lockedReservation.update(
        { status: ReservationStatus.EXPIRED },
        { transaction }
      );

      // Restore inventory: increase availableStock by 1
      drop.availableStock += 1;
      await drop.save({ transaction });

      // Notify reservation owner that their reservation expired
      const expiredPayload: ReservationExpiredPayload = {
        reservationId: lockedReservation.id,
        dropId: drop.id,
      };
      this.socketService.toUser(lockedReservation.userId, EVENTS.RESERVATION.EXPIRED, expiredPayload);

      // Broadcast updated stock to all connected clients
      const stockPayload: StockUpdatedPayload = {
        dropId: drop.id,
        stock: drop.availableStock,
      };
      this.socketService.broadcast(EVENTS.DROP.STOCK_UPDATED, stockPayload);
    });
  }
}

export default ReservationExpirationService;

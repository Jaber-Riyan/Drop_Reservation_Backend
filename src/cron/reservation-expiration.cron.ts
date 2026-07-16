import cron from 'node-cron';
import type { SocketService } from '../socket';
import ReservationExpirationService from '../modules/reservation/reservation-expiration.service';

/**
 * Reservation Expiration Cron
 *
 * Runs every second to process expired reservations.
 *
 * Flow:
 * 1. Find all ACTIVE reservations where expiresAt <= NOW()
 * 2. For each expired reservation:
 *    - Begin transaction
 *    - Lock the related Reservation row (FOR UPDATE) and confirm ACTIVE
 *    - Lock the related Drop row (FOR UPDATE)
 *    - Update reservation status: ACTIVE -> EXPIRED
 *    - Increase drop.availableStock by 1
 *    - Commit transaction
 *
 * This cron is intentionally thin. ALL business logic lives in
 * ReservationExpirationService.processExpiredReservations().
 */
export function startReservationExpirationCron(socketService: SocketService): void {
  const reservationExpirationService = new ReservationExpirationService(socketService);

  cron.schedule('* * * * * *', async () => {
    try {
      await reservationExpirationService.processExpiredReservations();
    } catch (error) {
      console.error('[Cron] Error processing expired reservations:', error);
    }
  });

  console.log('✓ Reservation expiration cron started (runs every second)');
}

import BaseRepository from '../../repositories/BaseRepository';
import Reservation from './reservation.model';
import { ReservationStatus } from './reservation.interface';
import { FindOptions, UpdateOptions, Op } from 'sequelize';
import sequelize from '../../database/sequelize';

/**
 * ReservationRepository - handles database operations for the Reservation model.
 *
 * Extends BaseRepository to inherit standard CRUD operations.
 * Adds reservation-specific query methods needed by the service.
 *
 * This layer ONLY performs database operations. No business logic.
 */
class ReservationRepository extends BaseRepository<Reservation> {
  constructor() {
    super(Reservation);
  }

  /**
   * Find an active reservation for a specific user and drop.
   * Used to enforce "one user can only have ONE ACTIVE reservation per drop".
   */
  async findActiveByUserAndDrop(userId: number, dropId: number, options?: FindOptions): Promise<Reservation | null> {
    return this.findOne({
      where: {
        userId,
        dropId,
        status: ReservationStatus.ACTIVE,
      },
      ...options,
    });
  }

  /**
   * Find all ACTIVE reservations for a specific user.
   * Used to show the user their current active holds.
   */
  async findActiveByUserId(userId: number, options?: FindOptions): Promise<Reservation[]> {
    return this.findAll({
      where: {
        userId,
        status: ReservationStatus.ACTIVE,
      },
      ...options,
    });
  }

  /**
   * Find all ACTIVE reservations that have expired (expiresAt <= NOW()).
   *
   * This is used by the expiration cron to identify reservations that need
   * to be marked as EXPIRED and have their drop stock restored.
   */
  async findExpiredActiveReservations(): Promise<Reservation[]> {
    return this.findAll({
      where: {
        status: ReservationStatus.ACTIVE,
        expiresAt: {
          [Op.lte]: sequelize.literal('NOW()'),
        },
      },
    });
  }

  /**
   * Update the status of a reservation.
   *
   * Returns the updated reservation instance, or null if the reservation
   * is not found. The transaction option should be provided when this is
   * called inside a larger atomic operation.
   */
  async updateStatus(id: number, status: ReservationStatus, options?: Omit<UpdateOptions, 'where'>): Promise<Reservation | null> {
    const reservation = await this.findById(id, options);
    if (!reservation) {
      return null;
    }
    await reservation.update({ status }, options as any);
    return reservation;
  }
}

export default ReservationRepository;
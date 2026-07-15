import BaseRepository from '../../repositories/BaseRepository';
import Reservation from './reservation.model';
import { ReservationStatus } from './reservation.interface';
import { FindOptions } from 'sequelize';

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
}

export default ReservationRepository;
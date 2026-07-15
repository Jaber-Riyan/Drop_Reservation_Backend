import { Optional } from 'sequelize';

/**
 * Reservation status enum.
 * ACTIVE   - Reservation is active (within 60-second window)
 * PURCHASED - Reservation has been converted to a purchase
 * EXPIRED  - Reservation has expired (past 60-second window)
 */
export enum ReservationStatus {
  ACTIVE = 'ACTIVE',
  PURCHASED = 'PURCHASED',
  EXPIRED = 'EXPIRED',
}

/**
 * Reservation attributes representing the shape of a Reservation record in the database.
 */
export interface IReservation {
  id: number;
  userId: number;
  dropId: number;
  status: ReservationStatus;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface for creating a new Reservation.
 * id, createdAt, and updatedAt are auto-generated.
 * expiresAt is calculated by the service layer (createdAt + 60 seconds).
 * status defaults to ACTIVE.
 */
export interface IReservationCreation extends Optional<IReservation, 'id' | 'expiresAt' | 'createdAt' | 'updatedAt'> {}
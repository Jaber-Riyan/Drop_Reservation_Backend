/**
 * Reservation module barrel file.
 *
 * Exports the model, routes, and other module components.
 * Importing this file registers the Reservation model with Sequelize
 * and makes the routes available for mounting.
 */
export { default as Reservation } from './reservation.model';
export { default as reservationRoutes } from './reservation.routes';
export { default as ReservationService } from './reservation.service';
export { default as ReservationController } from './reservation.controller';
export { default as ReservationRepository } from './reservation.repository';
export { ReservationStatus } from './reservation.interface';
export type { IReservation, IReservationCreation } from './reservation.interface';
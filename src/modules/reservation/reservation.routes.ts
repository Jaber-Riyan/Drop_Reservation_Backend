import { Router } from 'express';
import ReservationController from './reservation.controller';
import ReservationService from './reservation.service';

/**
 * Reservation routes.
 *
 * This file ONLY defines which HTTP methods and paths map to which controller methods.
 * No business logic should ever be placed here.
 *
 * Routes defined:
 * - POST /reservations           - Create a new reservation
 * - GET  /reservations           - Get all reservations
 * - GET  /reservations/user/:userId - Get active reservations for a user
 * - GET  /reservations/:id       - Get a reservation by ID
 */
export function createReservationRoutes(reservationService: ReservationService): Router {
  const router = Router();
  const reservationController = new ReservationController(reservationService);

  router.post('/reservations', (req, res, next) => reservationController.create(req, res, next));
  router.get('/reservations', (req, res, next) => reservationController.getAll(req, res, next));
  router.get('/reservations/user/:userId', (req, res, next) => reservationController.getActiveByUser(req, res, next));
  router.get('/reservations/:id', (req, res, next) => reservationController.getById(req, res, next));

  return router;
}

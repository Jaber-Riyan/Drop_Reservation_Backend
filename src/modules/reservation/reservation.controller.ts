import { Request, Response, NextFunction } from 'express';
import ReservationService from './reservation.service';
import { sendSuccess, sendCreated, sendError } from '../../utils/response';
import { createReservationSchema } from './reservation.validation';

/**
 * ReservationController - handles HTTP request/response for Reservation endpoints.
 *
 * Responsibilities:
 * - Parse request parameters, body, and query strings
 * - Validate incoming request bodies using Zod schemas
 * - Call the appropriate service method
 * - Return a formatted response using the response helpers
 * - Forward errors to the error middleware via next()
 *
 * This layer contains NO business logic.
 */
class ReservationController {
  private reservationService: ReservationService;

  constructor() {
    this.reservationService = new ReservationService();
  }

  /**
   * POST /reservations
   * Create a new reservation.
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request body using Zod schema
      const parsed = createReservationSchema.safeParse(req.body);

      if (!parsed.success) {
        const errorMessages = parsed.error.issues.map((issue) => issue.message);
        sendError(res, 'Validation failed', 400, errorMessages);
        return;
      }

      const reservation = await this.reservationService.createReservation(
        parsed.data.userId,
        parsed.data.dropId
      );

      sendCreated(res, 'Reservation created successfully', reservation);
    } catch (error) {
      // Business logic errors (no stock, duplicate reservation, drop not found)
      // are thrown as regular Errors and caught here
      if (error instanceof Error) {
        const message = error.message;

        if (message === 'Drop not found') {
          sendError(res, message, 404);
          return;
        }

        if (
          message === 'No available stock for this drop' ||
          message === 'User already has an active reservation for this drop'
        ) {
          sendError(res, message, 409);
          return;
        }
      }

      next(error);
    }
  }

  /**
   * GET /reservations
   * Get all reservations.
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reservations = await this.reservationService.getReservations();
      sendSuccess(res, 'Reservations retrieved successfully', reservations);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /reservations/:id
   * Get a single reservation by ID.
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idParam = req.params.id as string;
      const id = parseInt(idParam, 10);

      if (isNaN(id)) {
        sendError(res, 'Invalid reservation ID', 400);
        return;
      }

      const reservation = await this.reservationService.getReservation(id);

      if (!reservation) {
        sendError(res, 'Reservation not found', 404);
        return;
      }

      sendSuccess(res, 'Reservation retrieved successfully', reservation);
    } catch (error) {
      next(error);
    }
  }
}

export default ReservationController;
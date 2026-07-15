import { Request, Response, NextFunction } from 'express';
import PurchaseService from './purchase.service';
import { sendSuccess, sendCreated, sendError } from '../../utils/response';
import { createPurchaseSchema } from './purchase.validation';

/**
 * PurchaseController - handles HTTP request/response for Purchase endpoints.
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
class PurchaseController {
  private purchaseService: PurchaseService;

  constructor() {
    this.purchaseService = new PurchaseService();
  }

  /**
   * POST /purchases
   * Create a new purchase from an active reservation.
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request body using Zod schema
      const parsed = createPurchaseSchema.safeParse(req.body);

      if (!parsed.success) {
        const errorMessages = parsed.error.issues.map((issue) => issue.message);
        sendError(res, 'Validation failed', 400, errorMessages);
        return;
      }

      const purchase = await this.purchaseService.createPurchase(
        parsed.data.userId,
        parsed.data.dropId,
        parsed.data.reservationId
      );

      sendCreated(res, 'Purchase created successfully', purchase);
    } catch (error) {
      // Business logic errors are thrown as regular Errors and caught here
      if (error instanceof Error) {
        const message = error.message;

        if (message === 'Reservation not found') {
          sendError(res, message, 404);
          return;
        }

        if (message === 'Reservation does not belong to this user') {
          sendError(res, message, 403);
          return;
        }

        if (
          message === 'Reservation is not active' ||
          message === 'Reservation has expired'
        ) {
          sendError(res, message, 409);
          return;
        }
      }

      next(error);
    }
  }

  /**
   * GET /purchases
   * Get all purchases.
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const purchases = await this.purchaseService.getPurchases();
      sendSuccess(res, 'Purchases retrieved successfully', purchases);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /purchases/:id
   * Get a single purchase by ID.
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idParam = req.params.id as string;
      const id = parseInt(idParam, 10);

      if (isNaN(id)) {
        sendError(res, 'Invalid purchase ID', 400);
        return;
      }

      const purchase = await this.purchaseService.getPurchase(id);

      if (!purchase) {
        sendError(res, 'Purchase not found', 404);
        return;
      }

      sendSuccess(res, 'Purchase retrieved successfully', purchase);
    } catch (error) {
      next(error);
    }
  }
}

export default PurchaseController;
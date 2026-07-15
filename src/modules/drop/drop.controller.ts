import { Request, Response, NextFunction } from 'express';
import DropService from './drop.service';
import { sendSuccess, sendCreated, sendError } from '../../utils/response';
import { createDropSchema, updateDropSchema, toDate } from './drop.validation';

/**
 * DropController - handles HTTP request/response for Drop endpoints.
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
class DropController {
  private dropService: DropService;

  constructor() {
    this.dropService = new DropService();
  }

  /**
   * POST /drops
   * Create a new drop.
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request body using Zod schema
      const parsed = createDropSchema.safeParse(req.body);

      if (!parsed.success) {
        const errorMessages = parsed.error.issues.map((issue) => issue.message);
        sendError(res, 'Validation failed', 400, errorMessages);
        return;
      }

      const drop = await this.dropService.createDrop({
        name: parsed.data.name,
        category: parsed.data.category,
        initialStock: parsed.data.initialStock,
        startsAt: toDate(parsed.data.startsAt),
      });

      sendCreated(res, 'Drop created successfully', drop);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /drops
   * Get all drops.
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const drops = await this.dropService.getDrops();
      sendSuccess(res, 'Drops retrieved successfully', drops);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /drops/:id
   * Get a single drop by ID.
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idParam = req.params.id as string;
      const id = parseInt(idParam, 10);

      if (isNaN(id)) {
        sendError(res, 'Invalid drop ID', 400);
        return;
      }

      const drop = await this.dropService.getDrop(id);

      if (!drop) {
        sendError(res, 'Drop not found', 404);
        return;
      }

      sendSuccess(res, 'Drop retrieved successfully', drop);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /drops/:id
   * Update a drop by ID.
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idParam = req.params.id as string;
      const id = parseInt(idParam, 10);

      if (isNaN(id)) {
        sendError(res, 'Invalid drop ID', 400);
        return;
      }

      // Validate request body using Zod schema
      const parsed = updateDropSchema.safeParse(req.body);

      if (!parsed.success) {
        const errorMessages = parsed.error.issues.map((issue) => issue.message);
        sendError(res, 'Validation failed', 400, errorMessages);
        return;
      }

      // Remove availableStock (always undefined from Zod) and convert startsAt to Date if provided
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { availableStock, ...validatedData } = parsed.data;
      const updateData = {
        ...validatedData,
        startsAt: parsed.data.startsAt ? toDate(parsed.data.startsAt) : undefined,
      };

      const drop = await this.dropService.updateDrop(id, updateData);

      if (!drop) {
        sendError(res, 'Drop not found', 404);
        return;
      }

      sendSuccess(res, 'Drop updated successfully', drop);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /drops/:id
   * Delete a drop by ID.
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idParam = req.params.id as string;
      const id = parseInt(idParam, 10);

      if (isNaN(id)) {
        sendError(res, 'Invalid drop ID', 400);
        return;
      }

      const deleted = await this.dropService.deleteDrop(id);

      if (!deleted) {
        sendError(res, 'Drop not found', 404);
        return;
      }

      sendSuccess(res, 'Drop deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default DropController;
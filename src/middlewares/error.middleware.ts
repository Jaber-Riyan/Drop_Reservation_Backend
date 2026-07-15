import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

/**
 * Centralized error handling middleware.
 *
 * This middleware catches all errors thrown (or passed via next(error))
 * from controllers and services, and returns a standardized error response.
 *
 * All errors end up here - never catch errors in individual controllers.
 * Simply throw the error or pass it to next() and this middleware handles it.
 */
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  console.error(`[Error] ${err.message}`, err.stack);

  // Determine the status code based on error type
  const statusCode = err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError'
    ? 400
    : err.name === 'SequelizeForeignKeyConstraintError'
      ? 409
      : 500;

  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'Internal server error'
    : err.message || 'Internal server error';

  sendError(res, message, statusCode);
}
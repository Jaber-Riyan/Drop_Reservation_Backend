import { Request, Response } from 'express';
import { sendError } from '../utils/response';

/**
 * 404 Not Found middleware.
 *
 * This middleware should be registered AFTER all route handlers.
 * If a request reaches here, it means no route matched the request path.
 */
export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}
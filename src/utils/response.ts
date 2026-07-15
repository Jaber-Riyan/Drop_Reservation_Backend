import { Response } from 'express';

/**
 * Standardized API response helpers.
 *
 * Every controller should use these functions to return consistent responses.
 * This ensures the frontend always receives the same shape of data.
 */

interface SuccessResponse<T = unknown> {
  success: true;
  message: string;
  data?: T;
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: unknown[];
}

/**
 * Send a success response with optional data.
 */
export function sendSuccess<T>(res: Response, message: string, data?: T, statusCode = 200): void {
  const response: SuccessResponse<T> = {
    success: true,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  res.status(statusCode).json(response);
}

/**
 * Send a success response for resource creation (201).
 */
export function sendCreated<T>(res: Response, message: string, data?: T): void {
  sendSuccess(res, message, data, 201);
}

/**
 * Send an error response with optional error details.
 */
export function sendError(res: Response, message: string, statusCode = 500, errors?: unknown[]): void {
  const response: ErrorResponse = {
    success: false,
    message,
  };

  if (errors !== undefined) {
    response.errors = errors;
  }

  res.status(statusCode).json(response);
}
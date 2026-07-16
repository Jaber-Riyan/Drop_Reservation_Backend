import express, { Router } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/notFound.middleware';

const app = express();

// -------------------------------------
// Global Middleware
// -------------------------------------

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// -------------------------------------
// Route Mounting
// -------------------------------------

/**
 * Mount all application routes.
 *
 * Must be called BEFORE mountErrorHandlers().
 */
export function mountRoutes(router: Router): void {
  app.use(router);
}

// -------------------------------------
// Error Middleware
// -------------------------------------

/**
 * Mount error handling middleware.
 *
 * IMPORTANT:
 * This MUST be called AFTER all routes have been mounted.
 */
export function mountErrorHandlers(): void {
  // 404 Handler
  app.use(notFoundHandler);

  // Global Error Handler
  app.use(errorHandler);
}

export default app;
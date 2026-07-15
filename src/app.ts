import express from 'express';
import cors from 'cors';
import router from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/notFound.middleware';

/**
 * Express application setup.
 *
 * This file creates and configures the Express app with:
 * - CORS middleware for cross-origin requests
 * - JSON body parsing
 * - All registered routes
 * - 404 handler for unmatched routes
 * - Centralized error handler
 *
 * The app is not started here - that happens in server.ts.
 * This separation allows for easier testing.
 */
const app = express();

// --- Middleware ---

// Enable CORS for all origins (restrict in production)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.use(router);

// --- Error Handling ---

// Handle 404 - must be registered AFTER routes
app.use(notFoundHandler);

// Handle all errors - must be registered LAST
app.use(errorHandler);

export default app;
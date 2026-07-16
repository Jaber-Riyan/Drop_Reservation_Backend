import { Router } from 'express';
import app, { mountErrorHandlers } from '../src/app';
import { createRoutes } from '../src/routes';
import ReservationService from '../src/modules/reservation/reservation.service';
import type { SocketService } from '../src/socket';

/**
 * Vercel serverless function entry point.
 *
 * Vercel will call this exported handler for each request.
 * Socket.IO is NOT initialized here (not supported in serverless).
 * The app still works for all HTTP routes.
 */

// Create services without Socket.IO (not supported in serverless)
const mockSocketService = {} as SocketService;
const reservationService = new ReservationService();
reservationService.setSocketService(mockSocketService);

// Create routes with services
const router = createRoutes(mockSocketService, reservationService);

// Mount routes and error handlers
app.use(router);
mountErrorHandlers();

export default app;

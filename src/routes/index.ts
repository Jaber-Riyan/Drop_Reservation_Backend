import { Router, Request, Response } from 'express';
import userRoutes from '../modules/user/user.routes';
import dropRoutes from '../modules/drop/drop.routes';
import reservationRoutes from '../modules/reservation/reservation.routes';
import { createPurchaseRoutes } from '../modules/purchase/purchase.routes';
import activityRoutes from '../modules/activity/activity.routes';
import { sendSuccess, sendError } from '../utils/response';
import sequelize from '../database/sequelize';
import type { SocketService } from '../socket';

/**
 * Create the main application router.
 *
 * @param socketService - The SocketService instance, required for routes
 *                        that need to emit real-time events.
 */
export function createRoutes(socketService: SocketService): Router {
  const router = Router();

  /**
   * GET /
   * Root endpoint - returns API status.
   */
  router.get('/', (req: Request, res: Response) => {
    sendSuccess(res, 'Techzu Assessment API Running');
  });

  /**
   * GET /health
   * Health check endpoint - verifies database connectivity.
   */
  router.get('/health', async (req: Request, res: Response) => {
    try {
      await sequelize.authenticate();
      sendSuccess(res, 'Health check successful', { database: 'connected' });
    } catch (error) {
      sendError(res, 'Database connection failed', 503, [
        { database: 'disconnected' },
      ]);
    }
  });

  // Register module routes
  router.use(userRoutes);
  router.use(dropRoutes);
  router.use(reservationRoutes);
  router.use(createPurchaseRoutes(socketService));
  router.use(activityRoutes);

  return router;
}
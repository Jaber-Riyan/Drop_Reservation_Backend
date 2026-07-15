import { Router, Request, Response } from 'express';
import userRoutes from '../modules/user/user.routes';
import dropRoutes from '../modules/drop/drop.routes';
import reservationRoutes from '../modules/reservation/reservation.routes';
import { sendSuccess, sendError } from '../utils/response';
import sequelize from '../database/sequelize';

/**
 * Main router - aggregates all module routes.
 *
 * When adding a new module, import its routes here and register them.
 * Example:
 * import dropRoutes from '../modules/drop/drop.routes';
 * router.use(dropRoutes);
 */
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

// Future module routes will be registered here:
router.use(reservationRoutes);
// router.use('/api/purchases', purchaseRoutes);
// router.use('/api/activities', activityRoutes);

export default router;
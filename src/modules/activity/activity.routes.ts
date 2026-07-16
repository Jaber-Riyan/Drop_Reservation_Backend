import { Router } from 'express';
import ActivityController from './activity.controller';

/**
 * Activity routes.
 *
 * This file ONLY defines which HTTP methods and paths map to which controller methods.
 * No business logic should ever be placed here.
 *
 * Routes defined:
 * - GET  /activity/latest   - Get the latest 3 completed purchases
 */
const router = Router();
const activityController = new ActivityController();

router.get('/activity/latest', (req, res, next) => activityController.getLatest(req, res, next));

export default router;

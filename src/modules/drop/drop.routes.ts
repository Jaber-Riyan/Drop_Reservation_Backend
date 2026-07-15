import { Router } from 'express';
import DropController from './drop.controller';

/**
 * Drop routes.
 *
 * This file ONLY defines which HTTP methods and paths map to which controller methods.
 * No business logic should ever be placed here.
 *
 * Routes defined:
 * - POST   /drops       - Create a new drop
 * - GET    /drops       - Get all drops
 * - GET    /drops/:id   - Get a drop by ID
 * - PATCH  /drops/:id   - Update a drop by ID
 * - DELETE /drops/:id   - Delete a drop by ID
 */
const router = Router();
const dropController = new DropController();

router.post('/drops', (req, res, next) => dropController.create(req, res, next));
router.get('/drops', (req, res, next) => dropController.getAll(req, res, next));
router.get('/drops/:id', (req, res, next) => dropController.getById(req, res, next));
router.patch('/drops/:id', (req, res, next) => dropController.update(req, res, next));
router.delete('/drops/:id', (req, res, next) => dropController.delete(req, res, next));

export default router;
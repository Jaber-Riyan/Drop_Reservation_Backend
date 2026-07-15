import { Router } from 'express';
import PurchaseController from './purchase.controller';

/**
 * Purchase routes.
 *
 * This file ONLY defines which HTTP methods and paths map to which controller methods.
 * No business logic should ever be placed here.
 *
 * Routes defined:
 * - POST /purchases       - Create a new purchase
 * - GET  /purchases       - Get all purchases
 * - GET  /purchases/:id   - Get a purchase by ID
 */
const router = Router();
const purchaseController = new PurchaseController();

router.post('/purchases', (req, res, next) => purchaseController.create(req, res, next));
router.get('/purchases', (req, res, next) => purchaseController.getAll(req, res, next));
router.get('/purchases/:id', (req, res, next) => purchaseController.getById(req, res, next));

export default router;
import { Router } from 'express';
import PurchaseController from './purchase.controller';
import type { SocketService } from '../../socket';

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
export function createPurchaseRoutes(socketService: SocketService): Router {
  const router = Router();
  const purchaseController = new PurchaseController(socketService);

  router.post('/purchases', (req, res, next) => purchaseController.create(req, res, next));
  router.get('/purchases', (req, res, next) => purchaseController.getAll(req, res, next));
  router.get('/purchases/:id', (req, res, next) => purchaseController.getById(req, res, next));

  return router;
}
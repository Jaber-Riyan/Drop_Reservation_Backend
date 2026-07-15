/**
 * Purchase module barrel file.
 *
 * Exports the model, routes, and other module components.
 * Importing this file registers the Purchase model with Sequelize
 * and makes the routes available for mounting.
 */
export { default as Purchase } from './purchase.model';
export { default as purchaseRoutes } from './purchase.routes';
export { default as PurchaseService } from './purchase.service';
export { default as PurchaseController } from './purchase.controller';
export { default as PurchaseRepository } from './purchase.repository';
export type { IPurchase, IPurchaseCreation } from './purchase.interface';
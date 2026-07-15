import BaseRepository from '../../repositories/BaseRepository';
import Purchase from './purchase.model';

/**
 * PurchaseRepository - handles database operations for the Purchase model.
 *
 * Extends BaseRepository to inherit standard CRUD operations.
 * Add purchase-specific query methods here as needed.
 *
 * This layer ONLY performs database operations. No business logic.
 */
class PurchaseRepository extends BaseRepository<Purchase> {
  constructor() {
    super(Purchase);
  }
}

export default PurchaseRepository;
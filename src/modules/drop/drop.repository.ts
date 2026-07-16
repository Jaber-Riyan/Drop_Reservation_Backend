import BaseRepository from '../../repositories/BaseRepository';
import Drop from './drop.model';
import { Transaction } from 'sequelize';

/**
 * DropRepository - handles database operations for the Drop model.
 *
 * Extends BaseRepository to inherit standard CRUD operations.
 * Add drop-specific query methods here as needed.
 *
 * Examples of future methods:
 * - findActiveDrops(): Promise<Drop[]>
 * - findDropsByCategory(category: string): Promise<Drop[]>
 */
class DropRepository extends BaseRepository<Drop> {
  constructor() {
    super(Drop);
  }

  /**
   * Lock a Drop row using FOR UPDATE within the given transaction.
   *
   * This acquires a row-level lock so that concurrent transactions
   * (e.g. reservation creation, purchase, or expiration) cannot modify
   * the same drop's stock simultaneously.
   *
   * Returns the locked Drop instance, or null if not found.
   */
  async lockById(id: number, transaction: Transaction): Promise<Drop | null> {
    return this.findById(id, { transaction, lock: Transaction.LOCK.UPDATE });
  }

  /**
   * Increase the availableStock of a Drop by the given amount.
   *
   * The Drop row should be locked before calling this method to prevent
   * race conditions. This method atomically increments and saves the
   * updated stock within the provided transaction.
   *
   * Returns the updated Drop instance, or null if not found.
   */
  async increaseAvailableStock(id: number, amount: number, transaction: Transaction): Promise<Drop | null> {
    const drop = await this.lockById(id, transaction);
    if (!drop) {
      return null;
    }
    drop.availableStock += amount;
    await drop.save({ transaction });
    return drop;
  }
}

export default DropRepository;
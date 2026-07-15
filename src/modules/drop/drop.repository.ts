import BaseRepository from '../../repositories/BaseRepository';
import Drop from './drop.model';

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
}

export default DropRepository;
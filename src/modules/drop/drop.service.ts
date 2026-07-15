import DropRepository from './drop.repository';
import Drop from './drop.model';
import { IDropUpdate } from './drop.interface';

/**
 * DropService - contains ALL business logic related to Drops.
 *
 * Business rules enforced here:
 * - availableStock must equal initialStock when a Drop is created
 * - initialStock cannot be negative (also validated at DB level)
 * - availableStock is never directly settable through the API
 * - availableStock will later be updated only by Reservation logic
 * - startsAt is required
 *
 * This layer:
 * - Coordinates with the repository for data access
 * - Contains business rules and validation
 * - Does NOT know anything about Express (no req/res)
 * - Can be tested independently of the HTTP layer
 */
class DropService {
  private dropRepository: DropRepository;

  constructor() {
    this.dropRepository = new DropRepository();
  }

  /**
   * Create a new Drop.
   * availableStock is automatically set to equal initialStock.
   */
  async createDrop(data: { name: string; category: string; initialStock: number; startsAt: Date }): Promise<Drop> {
    // availableStock starts equal to initialStock
    const dropData = {
      name: data.name,
      category: data.category,
      initialStock: data.initialStock,
      availableStock: data.initialStock,
      startsAt: data.startsAt,
    };

    return this.dropRepository.create(dropData);
  }

  /**
   * Get all Drops from the database.
   */
  async getDrops(): Promise<Drop[]> {
    return this.dropRepository.findAll();
  }

  /**
   * Get a single Drop by its ID.
   */
  async getDrop(id: number): Promise<Drop | null> {
    return this.dropRepository.findById(id);
  }

  /**
   * Update a Drop.
   * availableStock is excluded from updates - it cannot be manually changed.
   * If initialStock is updated, availableStock is NOT automatically adjusted.
   * (That will be handled by Reservation/Expiration logic later.)
   */
  async updateDrop(id: number, data: IDropUpdate): Promise<Drop | null> {
    const drop = await this.dropRepository.findById(id);
    if (!drop) {
      return null;
    }

    // Only allow updating allowed fields
    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    if (data.category !== undefined) {
      updateData.category = data.category;
    }
    if (data.initialStock !== undefined) {
      updateData.initialStock = data.initialStock;
    }
    if (data.startsAt !== undefined) {
      updateData.startsAt = data.startsAt;
    }

    return this.dropRepository.update(id, updateData);
  }

  /**
   * Delete a Drop by its ID.
   */
  async deleteDrop(id: number): Promise<boolean> {
    return this.dropRepository.delete(id);
  }
}

export default DropService;
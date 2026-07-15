import { Model, ModelStatic, FindOptions, CreateOptions, UpdateOptions, DestroyOptions } from 'sequelize';

/**
 * BaseRepository - Generic CRUD base class for all repositories.
 *
 * Every repository in the application extends this class to inherit
 * standard database operations without duplicating code.
 *
 * T represents a Sequelize Model class.
 * Usage: class UserRepository extends BaseRepository<User> { ... }
 */
class BaseRepository<T extends Model> {
  /**
   * The Sequelize model instance this repository operates on.
   * Marked as protected so child repositories can access it for custom queries.
   */
  protected model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  /**
   * Create a new record in the database.
   */
  async create(data: Record<string, unknown>, options?: CreateOptions): Promise<T> {
    return this.model.create(data as any, options);
  }

  /**
   * Find a record by its primary key.
   */
  async findById(id: string | number, options?: FindOptions): Promise<T | null> {
    return this.model.findByPk(id, options);
  }

  /**
   * Find all records matching optional filters.
   */
  async findAll(options?: FindOptions): Promise<T[]> {
    return this.model.findAll(options);
  }

  /**
   * Find a single record matching the given where clause.
   */
  async findOne(options: FindOptions): Promise<T | null> {
    return this.model.findOne(options);
  }

  /**
   * Update a record by its primary key.
   * Returns the updated record, or null if not found.
   */
  async update(id: string | number, data: Record<string, unknown>, options?: Omit<UpdateOptions, 'where'>): Promise<T | null> {
    const record = await this.findById(id);
    if (!record) {
      return null;
    }
    await record.update(data, options);
    return record;
  }

  /**
   * Delete a record by its primary key.
   * Returns true if deleted, false if not found.
   */
  async delete(id: string | number, options?: Omit<DestroyOptions, 'where'>): Promise<boolean> {
    const record = await this.findById(id);
    if (!record) {
      return false;
    }
    await record.destroy(options);
    return true;
  }

  /**
   * Count records matching optional where clause.
   */
  async count(options?: FindOptions): Promise<number> {
    return this.model.count(options);
  }
}

export default BaseRepository;
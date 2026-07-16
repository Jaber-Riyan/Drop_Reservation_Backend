import BaseRepository from '../../repositories/BaseRepository';
import User from './user.model';

/**
 * UserRepository - handles database operations for the User model.
 *
 * Extends BaseRepository to inherit standard CRUD operations.
 * Add user-specific query methods here as needed.
 *
 * Examples of future methods:
 * - searchByUsername(query: string): Promise<User[]>
 */
class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }

  /**
   * Find a user by their username.
   * Returns null if no user with the given username exists.
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.findOne({
      where: { username },
    });
  }
}

export default UserRepository;
import BaseRepository from '../../repositories/BaseRepository';
import User from './user.model';

/**
 * UserRepository - handles database operations for the User model.
 *
 * Extends BaseRepository to inherit standard CRUD operations.
 * Add user-specific query methods here as needed.
 *
 * Examples of future methods:
 * - findByUsername(username: string): Promise<User | null>
 * - searchByUsername(query: string): Promise<User[]>
 */
class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }
}

export default UserRepository;
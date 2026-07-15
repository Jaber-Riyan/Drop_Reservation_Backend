import UserRepository from './user.repository';
import User from './user.model';

/**
 * UserService - contains ALL business logic related to users.
 *
 * This layer:
 * - Coordinates with the repository for data access
 * - Contains business rules and logic
 * - Does NOT know anything about Express (no req/res)
 * - Can be tested independently of the HTTP layer
 */
class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Generate a random username like "User-4831".
   * The number is a random value between 1000 and 9999.
   */
  generateRandomUsername(): string {
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    return `User-${randomNum}`;
  }

  /**
   * Create a new user with a randomly generated username.
   */
  async createUser(): Promise<User> {
    const username = this.generateRandomUsername();
    return this.userRepository.create({ username });
  }

  /**
   * Get all users from the database.
   */
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  /**
   * Get a single user by their ID.
   */
  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}

export default UserService;
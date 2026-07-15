import { Request, Response, NextFunction } from 'express';
import UserService from './user.service';
import { sendSuccess, sendCreated, sendError } from '../../utils/response';

/**
 * UserController - handles HTTP request/response for User endpoints.
 *
 * Responsibilities:
 * - Parse request parameters, body, and query strings
 * - Call the appropriate service method
 * - Return a formatted response using the response helpers
 * - Forward errors to the error middleware via next()
 *
 * This layer contains NO business logic.
 */
class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * POST /test/users
   * Create a new user with a random username.
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.userService.createUser();
      sendCreated(res, 'User created successfully', user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /test/users
   * Get all users.
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      sendSuccess(res, 'Users retrieved successfully', users);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /test/users/:id
   * Get a single user by ID.
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idParam = req.params.id as string;
      const id = parseInt(idParam, 10);

      if (isNaN(id)) {
        sendError(res, 'Invalid user ID', 400);
        return;
      }

      const user = await this.userService.getUserById(id);

      if (!user) {
        sendError(res, 'User not found', 404);
        return;
      }

      sendSuccess(res, 'User retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
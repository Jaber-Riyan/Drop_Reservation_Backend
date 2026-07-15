/**
 * User module barrel export.
 *
 * This file exports everything related to the User module from a single entry point.
 * Other modules should import from here, not from individual files.
 *
 * Example:
 * import User from './modules/user';
 * // instead of
 * import User from './modules/user/user.model';
 */

export { default as User } from './user.model';
export { default as UserRepository } from './user.repository';
export { default as UserService } from './user.service';
export { default as UserController } from './user.controller';
export { default as userRoutes } from './user.routes';
export type { IUser, IUserCreation } from './user.interface';
import { Router } from 'express';
import UserController from './user.controller';

/**
 * User routes.
 *
 * This file ONLY defines which HTTP methods and paths map to which controller methods.
 * No business logic should ever be placed here.
 *
 * Routes defined:
 * - POST /test/users/register - Register a user with a specific username
 * - POST /test/users          - Create a new user with random username
 * - GET  /test/users          - Get all users
 * - GET  /test/users/:id      - Get a user by ID
 */
const router = Router();
const userController = new UserController();

router.post('/users/register', (req, res, next) => userController.register(req, res, next));
router.post('/test/users', (req, res, next) => userController.create(req, res, next));
router.get('/test/users', (req, res, next) => userController.getAll(req, res, next));
router.get('/test/users/:id', (req, res, next) => userController.getById(req, res, next));

export default router;
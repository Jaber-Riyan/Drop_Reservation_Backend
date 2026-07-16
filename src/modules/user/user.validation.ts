import { z } from 'zod';

/**
 * Schema for registering a user with a specific username.
 */
export const registerUserSchema = z.object({
  username: z.string().min(1, 'username is required').trim(),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
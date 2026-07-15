import { z } from 'zod';

/**
 * Reservation validation schemas using Zod.
 *
 * Validation happens in the controller layer before data reaches the service.
 */

/**
 * Schema for creating a new Reservation.
 *
 * Rules:
 * - userId is required and must be a positive integer
 * - dropId is required and must be a positive integer
 */
export const createReservationSchema = z.object({
  userId: z
    .number()
    .int('userId must be an integer')
    .positive('userId must be a positive integer'),
  dropId: z
    .number()
    .int('dropId must be an integer')
    .positive('dropId must be a positive integer'),
});

/**
 * Infer the TypeScript types from the Zod schemas.
 */
export type CreateReservationInput = z.infer<typeof createReservationSchema>;
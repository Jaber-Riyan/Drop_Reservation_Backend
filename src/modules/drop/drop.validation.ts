import { z } from 'zod';

/**
 * Drop validation schemas using Zod.
 *
 * Zod provides type-safe validation with clear error messages.
 * The schemas define the shape and constraints of incoming request bodies.
 * Validation happens in the controller layer before data reaches the service.
 */

/**
 * Helper function to parse a date string in multiple formats.
 * Supports:
 * - ISO format: "2026-07-20" or "2026-07-20T10:00:00Z"
 * - DD-MM-YYYY: "20-07-2026"
 * - DD/MM/YYYY: "20/07/2026"
 */
function parseDateString(val: string): boolean {
  // Try DD-MM-YYYY or DD/MM/YYYY format first
  const dmyMatch = val.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    const [, day, month, year] = dmyMatch;
    const date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00Z`);
    return !isNaN(date.getTime());
  }

  // Try standard ISO format
  return !isNaN(new Date(val).getTime());
}

/**
 * Schema for creating a new Drop.
 *
 * Rules:
 * - name is required and must be a non-empty string
 * - category is required and must be a non-empty string
 * - initialStock is required and must be a non-negative integer
 * - startsAt is required and must be a valid date string
 * - availableStock is NOT allowed here (set automatically by the service)
 */
export const createDropSchema = z.object({
  name: z
    .string()
    .min(1, 'name must be a non-empty string')
    .trim(),
  category: z
    .string()
    .min(1, 'category must be a non-empty string')
    .trim(),
  initialStock: z
    .number()
    .int('initialStock must be an integer')
    .min(0, 'initialStock cannot be negative'),
  startsAt: z
    .string()
    .refine((val) => parseDateString(val), {
      message: 'startsAt must be a valid date (e.g., "2026-07-20" or "20-07-2026")',
    }),
});

/**
 * Schema for updating a Drop.
 * All fields are optional, but if provided they must be valid.
 * availableStock is explicitly rejected - it cannot be manually edited.
 */
export const updateDropSchema = z.object({
  name: z
    .string()
    .min(1, 'name must be a non-empty string')
    .trim()
    .optional(),
  category: z
    .string()
    .min(1, 'category must be a non-empty string')
    .trim()
    .optional(),
  initialStock: z
    .number()
    .int('initialStock must be an integer')
    .min(0, 'initialStock cannot be negative')
    .optional(),
  startsAt: z
    .string()
    .refine((val) => parseDateString(val), {
      message: 'startsAt must be a valid date (e.g., "2026-07-20" or "20-07-2026")',
    })
    .optional(),
  availableStock: z
    .undefined({ message: 'availableStock cannot be manually updated' }),
});

/**
 * Converts a date string to a Date object.
 * Handles DD-MM-YYYY, DD/MM/YYYY, and ISO formats.
 */
export function toDate(val: string): Date {
  const dmyMatch = val.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    const [, day, month, year] = dmyMatch;
    return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00Z`);
  }
  return new Date(val);
}

/**
 * Infer the TypeScript types from the Zod schemas.
 * This ensures the types stay in sync with the validation rules.
 */
export type CreateDropInput = z.infer<typeof createDropSchema>;
export type UpdateDropInput = z.infer<typeof updateDropSchema>;
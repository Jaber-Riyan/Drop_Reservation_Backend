import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Environment configuration object.
 *
 * All environment variables are validated and exported from here.
 * This ensures that any missing required variables are caught at startup.
 * No other file should access process.env directly.
 */
export const env = {
  // Server port - defaults to 4000 if not set
  port: parseInt(process.env.PORT || '4000', 10),

  // PostgreSQL connection string for Neon
  databaseUrl: process.env.DATABASE_URL || '',

  // Current environment
  nodeEnv: process.env.NODE_ENV || 'development',

  // Convenience checks for current environment
  isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;

/**
 * Validates that required environment variables are present.
 * Call this at application startup to fail fast if configuration is missing.
 */
export function validateEnv(): void {
  const requiredVars: { key: string; value: string | undefined }[] = [
    { key: 'DATABASE_URL', value: process.env.DATABASE_URL },
  ];

  const missing = requiredVars.filter((v) => !v.value);

  if (missing.length > 0) {
    const missingKeys = missing.map((v) => v.key).join(', ');
    console.error(`Missing required environment variables: ${missingKeys}`);
    console.error('Please check your .env file or environment configuration.');
    process.exit(1);
  }
}
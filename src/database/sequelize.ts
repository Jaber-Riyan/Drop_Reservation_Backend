import { Sequelize } from 'sequelize';
import { env } from '../config/env';
import databaseConfig from '../config/database';

/**
 * Sequelize instance.
 *
 * The connection URI (DATABASE_URL) is passed explicitly as the first argument,
 * and the config object (with dialectOptions for SSL) as the second argument.
 * This ensures Neon's SSL requirements are properly applied.
 */
const envKey = env.nodeEnv as keyof typeof databaseConfig;
const config = databaseConfig[envKey] || databaseConfig.development;
const sequelize = new Sequelize(env.databaseUrl, config);

/**
 * Automatically loads and registers all models from the modules directory.
 *
 * Each module exports its model from its index.ts barrel file.
 * To add a new model, simply import it in its module's index.ts
 * and the model will be auto-registered here.
 */
export async function loadModels(): Promise<void> {
  // Import all module index files so their models are registered with Sequelize
  await import('../modules/user/user.model');

  // Future modules will be imported here:
  // await import('../modules/drop/drop.model');
  // await import('../modules/reservation/reservation.model');
  // await import('../modules/purchase/purchase.model');
  // await import('../modules/activity/activity.model');
}

/**
 * Initializes the database connection.
 *
 * Steps:
 * 1. Loads all models so they register with Sequelize
 * 2. Authenticates the connection
 * 3. Syncs models (only in development, without force)
 *
 * The application should exit if the database cannot be connected.
 */
export async function initializeDatabase(): Promise<void> {
  try {
    // Register all models with Sequelize
    await loadModels();

    // Test the database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully.');

    // Sync models in development mode only
    // This creates tables if they don't exist, but won't drop existing ones
    if (env.isDevelopment) {
      await sequelize.sync({ alter: false, force: false });
      console.log('✓ Database models synchronized.');
    }
  } catch (error) {
    console.error('✗ Unable to connect to the database:', error);
    process.exit(1);
  }
}

export default sequelize;
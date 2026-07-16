import app from './app';
import { env, validateEnv } from './config/env';
import { initializeDatabase } from './database/sequelize';
import { createServer } from 'http';
import { initializeSocket } from './socket';

/**
 * Application entry point.
 *
 * Startup sequence:
 * 1. Validate required environment variables
 * 2. Connect to the database and authenticate
 * 3. Sync models (development only)
 * 4. Start the Express server
 *
 * The server only starts listening AFTER the database connection is verified.
 * If the database connection fails, the process exits with an error.
 */
async function main(): Promise<void> {
  try {
    // Step 1: Validate environment variables
    validateEnv();

    // Step 2: Initialize database connection
    // This authenticates and syncs models before starting the server
    await initializeDatabase();

    // Step 3: Create HTTP server from Express app
    const server = createServer(app);

    // Step 4: Initialize Socket.IO
    const { socketService } = initializeSocket(server);

    // Step 5: Start the server
    server.listen(env.port, () => {
      console.log(`✓ Server running on port ${env.port}`);
      console.log(`✓ Environment: ${env.nodeEnv}`);
      console.log(`✓ API available at http://localhost:${env.port}`);
      console.log(`✓ Socket.IO initialized`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error | unknown) => {
  console.error('✗ Unhandled Rejection:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('✗ Uncaught Exception:', error);
  process.exit(1);
});

// Start the application
main();
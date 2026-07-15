/**
 * Sequelize database configuration for different environments.
 *
 * The connection URI is passed separately from src/database/sequelize.ts
 * using the env.databaseUrl value. This ensures SSL dialectOptions are
 * properly applied to Neon PostgreSQL connections.
 *
 * SSL is required because Neon (PostgreSQL) enforces it.
 * In development, we log queries for debugging.
 * In production, we keep logging minimal and use connection pooling.
 */
const databaseConfig = {
  development: {
    dialect: 'postgres' as const,
    logging: console.log,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Required for Neon SSL connections
      },
    },
  },
  test: {
    dialect: 'postgres' as const,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  production: {
    dialect: 'postgres' as const,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
  },
};

export default databaseConfig;
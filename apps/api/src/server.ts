import { app } from './app.js';
import { connectDatabase } from './infrastructure/database/mongoose.js';
import { env } from './shared/config/env.js';
import { logger } from './shared/logging/logger.js';

try {
  app.listen(env.API_PORT, () => logger.info({ port: env.API_PORT }, 'API listening'));
  void connectDatabase().catch((error: unknown) => {
    logger.fatal({ err: error }, 'MongoDB connection failed; readiness will remain unavailable');
  });
} catch (error) {
  logger.fatal({ err: error }, 'API startup failed');
  process.exitCode = 1;
}

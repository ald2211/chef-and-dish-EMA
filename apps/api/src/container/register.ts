import { createContainer, asFunction } from 'awilix';
import { databaseReady } from '../infrastructure/database/mongoose.js';
import { logger } from '../shared/logging/logger.js';

export const container = createContainer();
container.register({ logger: asFunction(() => logger).singleton(), databaseReady: asFunction(() => databaseReady).singleton() });

import pino from 'pino';
import { env } from '../config/env.js';

export const logger = pino({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'headers.authorization', 'headers.cookie', '*.password', '*.token', '*.email', '*.phone'],
    censor: '[REDACTED]'
  },
  base: { service: 'chef-and-dish-api', environment: env.NODE_ENV },
  ...(env.NODE_ENV === 'development' ? { transport: { target: 'pino-pretty' } } : {})
});

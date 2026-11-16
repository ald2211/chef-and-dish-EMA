import * as Sentry from '@sentry/node';
import { clerkMiddleware } from '@clerk/express';
import { randomUUID } from 'node:crypto';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { env } from './shared/config/env.js';
import { errorHandler } from './shared/http/error-handler.js';
import { logger } from './shared/logging/logger.js';
import { openApiDocument } from './shared/openapi/openapi.js';
import { identityRouter } from './modules/identity/presentation/routes.js';
import { healthRouter } from './modules/health/presentation/routes.js';

if (env.SENTRY_DSN) Sentry.init({ dsn: env.SENTRY_DSN, environment: env.NODE_ENV, sendDefaultPii: false, tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 0 });

export const app = express();
app.disable('x-powered-by');
if (env.clerkConfigured) app.use(clerkMiddleware({ authorizedParties: env.corsOrigins }));
app.use(helmet(env.NODE_ENV === 'production' ? {} : { contentSecurityPolicy: false }));
app.use(cors({ origin: env.corsOrigins, credentials: false }));
app.use(pinoHttp({ logger, genReqId: (request, response) => {
  const suppliedId = request.headers['x-request-id'];
  const requestId = typeof suppliedId === 'string' && /^[\w.-]{1,128}$/.test(suppliedId) ? suppliedId : randomUUID();
  response.setHeader('x-request-id', requestId);
  return requestId;
} }));
app.use(express.json({ limit: '100kb' }));
app.use('/api/v1', identityRouter);
app.use('/api/v1/health', healthRouter);
if (env.NODE_ENV !== 'production') {
  app.get('/api/openapi.json', (_request, response) => response.json(openApiDocument));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
}
app.use((_request, response) => response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found.', requestId: response.getHeader('x-request-id') } }));
app.use(errorHandler);

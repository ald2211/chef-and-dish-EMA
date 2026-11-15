import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import * as Sentry from '@sentry/node';
import { AppError } from '../errors/app-error.js';
import { logger } from '../logging/logger.js';

export const errorHandler: ErrorRequestHandler = (error: unknown, request, response, _next) => {
  void _next;
  const requestId = request.id;
  if (error instanceof AppError) {
    response.status(error.statusCode).json({ error: { code: error.code, message: error.message, requestId } });
    return;
  }
  if (error instanceof ZodError) {
    response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Request validation failed.', requestId } });
    return;
  }
  logger.error({ err: error, requestId }, 'Unhandled request error');
  Sentry.captureException(error, { extra: { requestId } });
  response.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.', requestId } });
};

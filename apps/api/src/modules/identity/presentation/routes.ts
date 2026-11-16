import { getAuth } from '@clerk/express';
import { Router } from 'express';
import { env } from '../../../shared/config/env.js';
import { AppError } from '../../../shared/errors/app-error.js';

export const identityRouter = Router();

identityRouter.get('/me', (request, response, next) => {
  if (!env.clerkConfigured) {
    next(new AppError(503, 'AUTH_NOT_CONFIGURED', 'Authentication is not configured.'));
    return;
  }

  const { userId } = getAuth(request);
  if (!userId) {
    next(new AppError(401, 'UNAUTHENTICATED', 'Authentication is required.'));
    return;
  }

  response.status(200).json({ data: { clerkUserId: userId } });
});

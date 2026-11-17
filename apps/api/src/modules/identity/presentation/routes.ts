import { getAuth } from '@clerk/express';
import { Router } from 'express';
import { z } from 'zod';
import { env } from '../../../shared/config/env.js';
import { AppError } from '../../../shared/errors/app-error.js';
import { provisionDriver } from '../application/provision-driver.js';
import { resolveIdentity } from '../application/resolve-identity.js';
import { MongooseUserRepository } from '../infrastructure/mongoose-user-repository.js';

export const identityRouter = Router();

const users = new MongooseUserRepository();
const provisionDriverRequest = z.object({ clerkUserId: z.string().regex(/^user_[A-Za-z0-9]+$/) }).strict();

identityRouter.get('/me', async (request, response, next) => {
  if (!env.clerkConfigured) {
    next(new AppError(503, 'AUTH_NOT_CONFIGURED', 'Authentication is not configured.'));
    return;
  }

  const { userId } = getAuth(request);
  if (!userId) {
    next(new AppError(401, 'UNAUTHENTICATED', 'Authentication is required.'));
    return;
  }

  const user = await resolveIdentity(userId, env.initialAdminClerkUserIds, users);
  response.status(200).json({ data: { clerkUserId: user.clerkUserId, role: user.role } });
});

identityRouter.post('/drivers', async (request, response, next) => {
  if (!env.clerkConfigured) {
    next(new AppError(503, 'AUTH_NOT_CONFIGURED', 'Authentication is not configured.'));
    return;
  }

  const { userId } = getAuth(request);
  if (!userId) {
    next(new AppError(401, 'UNAUTHENTICATED', 'Authentication is required.'));
    return;
  }

  const actor = await resolveIdentity(userId, env.initialAdminClerkUserIds, users);
  if (actor.role !== 'ADMIN') {
    next(new AppError(403, 'ADMIN_REQUIRED', 'Administrator access is required.'));
    return;
  }

  const parsedBody = provisionDriverRequest.safeParse(request.body);
  if (!parsedBody.success) {
    next(new AppError(400, 'VALIDATION_ERROR', 'Request validation failed.'));
    return;
  }

  await provisionDriver(parsedBody.data.clerkUserId, users);
  response.status(201).json({ data: { clerkUserId: parsedBody.data.clerkUserId, role: 'DRIVER' } });
});

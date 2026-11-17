import { getAuth } from '@clerk/express';
import { Router, type Request } from 'express';
import { z } from 'zod';
import { env } from '../../../shared/config/env.js';
import { AppError } from '../../../shared/errors/app-error.js';
import { resolveIdentity } from '../../identity/application/resolve-identity.js';
import type { IdentityUser } from '../../identity/domain/user.js';
import { MongooseUserRepository } from '../../identity/infrastructure/mongoose-user-repository.js';
import { assignDriver } from '../application/assign-driver.js';
import { createEvent } from '../application/create-event.js';
import { getEvent, listEvents } from '../application/get-event.js';
import { MongooseEventRepository } from '../infrastructure/mongoose-event-repository.js';

export const eventsRouter = Router();

const users = new MongooseUserRepository();
const events = new MongooseEventRepository();
const eventIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);
const createEventSchema = z.object({
  name: z.string().trim().min(1).max(160),
  startsAt: z.string().datetime({ offset: true }).transform((value) => new Date(value)),
  location: z.string().trim().min(1).max(240)
}).strict();
const assignDriverSchema = z.object({ clerkUserId: z.string().regex(/^user_[A-Za-z0-9]+$/) }).strict();

async function authenticatedUser(request: Request): Promise<IdentityUser> {
  if (!env.clerkConfigured) throw new AppError(503, 'AUTH_NOT_CONFIGURED', 'Authentication is not configured.');
  const { userId } = getAuth(request);
  if (!userId) throw new AppError(401, 'UNAUTHENTICATED', 'Authentication is required.');
  return resolveIdentity(userId, env.initialAdminClerkUserIds, users);
}

function requireAdmin(user: IdentityUser): void {
  if (user.role !== 'ADMIN') throw new AppError(403, 'ADMIN_REQUIRED', 'Administrator access is required.');
}

eventsRouter.post('/', async (request, response) => {
  const actor = await authenticatedUser(request);
  requireAdmin(actor);
  const input = createEventSchema.parse(request.body);
  const event = await createEvent(input, events);
  response.status(201).json({ data: event });
});

eventsRouter.get('/', async (request, response) => {
  const actor = await authenticatedUser(request);
  const result = await listEvents(actor.role, actor.clerkUserId, events);
  response.status(200).json({ data: result });
});

eventsRouter.get('/:eventId', async (request, response) => {
  const actor = await authenticatedUser(request);
  const eventId = eventIdSchema.parse(request.params.eventId);
  const event = await getEvent(eventId, actor.role, actor.clerkUserId, events);
  response.status(200).json({ data: event });
});

eventsRouter.post('/:eventId/drivers', async (request, response) => {
  const actor = await authenticatedUser(request);
  requireAdmin(actor);
  const eventId = eventIdSchema.parse(request.params.eventId);
  const input = assignDriverSchema.parse(request.body);
  await assignDriver(eventId, input.clerkUserId, users, events);
  response.status(204).end();
});

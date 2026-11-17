import { AppError } from '../../../shared/errors/app-error.js';
import type { EventRepository } from './event-repository.js';
import type { EventRecord } from '../domain/event.js';

type Role = 'ADMIN' | 'DRIVER';

export async function listEvents(role: Role, clerkUserId: string, events: EventRepository): Promise<EventRecord[]> {
  return events.listForActor(role, clerkUserId);
}

export async function getEvent(id: string, role: Role, clerkUserId: string, events: EventRepository): Promise<EventRecord> {
  const event = await events.findAccessibleById(id, role, clerkUserId);
  if (!event) throw new AppError(404, 'EVENT_NOT_FOUND', 'Event not found.');
  return event;
}

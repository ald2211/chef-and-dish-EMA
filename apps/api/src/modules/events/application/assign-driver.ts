import { AppError } from '../../../shared/errors/app-error.js';
import type { UserRepository } from '../../identity/application/user-repository.js';
import type { EventRepository } from './event-repository.js';

export async function assignDriver(eventId: string, driverClerkUserId: string, users: UserRepository, events: EventRepository): Promise<void> {
  const driver = await users.findByClerkUserId(driverClerkUserId);
  if (!driver || !driver.active || driver.role !== 'DRIVER') {
    throw new AppError(422, 'DRIVER_NOT_AVAILABLE', 'The selected account is not an active driver.');
  }

  const event = await events.assignDriver(eventId, driverClerkUserId);
  if (!event) throw new AppError(404, 'EVENT_NOT_FOUND', 'Event not found.');
}

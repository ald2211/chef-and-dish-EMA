import type { EventRepository } from './event-repository.js';
import type { EventRecord, NewEvent } from '../domain/event.js';

export function createEvent(event: NewEvent, events: EventRepository): Promise<EventRecord> {
  return events.create(event);
}

import type { EventRecord, NewEvent } from '../domain/event.js';

export interface EventRepository {
  create(event: NewEvent): Promise<EventRecord>;
  listForActor(role: 'ADMIN' | 'DRIVER', clerkUserId: string): Promise<EventRecord[]>;
  findAccessibleById(id: string, role: 'ADMIN' | 'DRIVER', clerkUserId: string): Promise<EventRecord | null>;
  assignDriver(id: string, clerkUserId: string): Promise<EventRecord | null>;
}

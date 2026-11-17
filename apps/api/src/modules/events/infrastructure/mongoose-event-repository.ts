import { Types } from 'mongoose';
import type { EventRepository } from '../application/event-repository.js';
import type { EventRecord, NewEvent } from '../domain/event.js';
import { EventModel } from './event-model.js';

interface EventRow {
  _id: Types.ObjectId;
  name: string;
  startsAt: Date;
  location: string;
  assignedDriverClerkUserIds: string[];
}

function toRecord(row: EventRow): EventRecord {
  return {
    id: row._id.toHexString(),
    name: row.name,
    startsAt: row.startsAt.toISOString(),
    location: row.location,
    assignedDriverClerkUserIds: row.assignedDriverClerkUserIds
  };
}

export class MongooseEventRepository implements EventRepository {
  async create(event: NewEvent): Promise<EventRecord> {
    const row = await EventModel.create({ ...event, assignedDriverClerkUserIds: [] });
    return toRecord({
      _id: row._id,
      name: row.name,
      startsAt: row.startsAt,
      location: row.location,
      assignedDriverClerkUserIds: row.assignedDriverClerkUserIds
    });
  }

  async listForActor(role: 'ADMIN' | 'DRIVER', clerkUserId: string): Promise<EventRecord[]> {
    const filter = role === 'ADMIN' ? {} : { assignedDriverClerkUserIds: clerkUserId };
    const rows = await EventModel.find(filter).sort({ startsAt: 1, _id: 1 }).lean<EventRow[]>().exec();
    return rows.map(toRecord);
  }

  async findAccessibleById(id: string, role: 'ADMIN' | 'DRIVER', clerkUserId: string): Promise<EventRecord | null> {
    const filter = role === 'ADMIN'
      ? { _id: new Types.ObjectId(id) }
      : { _id: new Types.ObjectId(id), assignedDriverClerkUserIds: clerkUserId };
    const row = await EventModel.findOne(filter).lean<EventRow>().exec();
    return row ? toRecord(row) : null;
  }

  async assignDriver(id: string, clerkUserId: string): Promise<EventRecord | null> {
    const row = await EventModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      { $addToSet: { assignedDriverClerkUserIds: clerkUserId } },
      { new: true, runValidators: true }
    ).lean<EventRow>().exec();
    return row ? toRecord(row) : null;
  }
}

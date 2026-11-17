import { model, Schema } from 'mongoose';

interface EventDocument {
  name: string;
  startsAt: Date;
  location: string;
  assignedDriverClerkUserIds: string[];
}

const eventSchema = new Schema<EventDocument>({
  name: { type: String, required: true, trim: true, maxlength: 160 },
  startsAt: { type: Date, required: true },
  location: { type: String, required: true, trim: true, maxlength: 240 },
  assignedDriverClerkUserIds: { type: [String], required: true, default: [] }
}, { timestamps: true, versionKey: false });

eventSchema.index({ assignedDriverClerkUserIds: 1, startsAt: 1 });

export const EventModel = model<EventDocument>('Event', eventSchema);

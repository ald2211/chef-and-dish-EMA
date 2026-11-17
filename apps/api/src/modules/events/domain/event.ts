export interface EventRecord {
  id: string;
  name: string;
  startsAt: string;
  location: string;
  assignedDriverClerkUserIds: string[];
}

export interface NewEvent {
  name: string;
  startsAt: Date;
  location: string;
}

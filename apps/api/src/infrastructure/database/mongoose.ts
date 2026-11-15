import mongoose from 'mongoose';
import { env } from '../../shared/config/env.js';

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
}

export function databaseReady(): boolean {
  return mongoose.connection.readyState === 1;
}

import dotenv from 'dotenv';
import { resolve } from 'node:path';
import { z } from 'zod';

dotenv.config({ path: resolve(process.cwd(), '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  API_CORS_ORIGINS: z.string().default('http://localhost:5173'),
  MONGODB_URI: z.string().min(1),
  SENTRY_DSN: z.string().default('')
}).strict();

const parsed = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  API_PORT: process.env.API_PORT,
  API_CORS_ORIGINS: process.env.API_CORS_ORIGINS,
  MONGODB_URI: process.env.MONGODB_URI,
  SENTRY_DSN: process.env.SENTRY_DSN
});
if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.issues.map((issue) => issue.path.join('.')).join(', ')}`);
}

export const env = {
  ...parsed.data,
  corsOrigins: parsed.data.API_CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
};

import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  API_CORS_ORIGINS: z.string().default('http://localhost:5173'),
  MONGODB_URI: z.string().min(1),
  SENTRY_DSN: z.string().default('')
}).strict();

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.issues.map((issue) => issue.path.join('.')).join(', ')}`);
}

export const env = {
  ...parsed.data,
  corsOrigins: parsed.data.API_CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
};

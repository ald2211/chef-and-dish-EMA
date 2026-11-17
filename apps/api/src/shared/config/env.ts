import dotenv from 'dotenv';
import { resolve } from 'node:path';
import { z } from 'zod';

dotenv.config({ path: resolve(process.cwd(), '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  API_CORS_ORIGINS: z.string().default('http://localhost:5173'),
  MONGODB_URI: z.string().min(1),
  SENTRY_DSN: z.string().default(''),
  CLERK_PUBLISHABLE_KEY: z.string().default(''),
  CLERK_SECRET_KEY: z.string().default(''),
  INITIAL_ADMIN_CLERK_USER_IDS: z.string().default('')
}).strict().superRefine((value, context) => {
  if (Boolean(value.CLERK_PUBLISHABLE_KEY) !== Boolean(value.CLERK_SECRET_KEY)) {
    context.addIssue({ code: 'custom', path: ['CLERK_PUBLISHABLE_KEY'], message: 'Both Clerk keys must be configured together.' });
  }
});

const parsed = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  API_PORT: process.env.API_PORT,
  API_CORS_ORIGINS: process.env.API_CORS_ORIGINS,
  MONGODB_URI: process.env.MONGODB_URI,
  SENTRY_DSN: process.env.SENTRY_DSN,
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  INITIAL_ADMIN_CLERK_USER_IDS: process.env.INITIAL_ADMIN_CLERK_USER_IDS
});
if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.issues.map((issue) => issue.path.join('.')).join(', ')}`);
}

export const env = {
  ...parsed.data,
  clerkConfigured: Boolean(parsed.data.CLERK_PUBLISHABLE_KEY && parsed.data.CLERK_SECRET_KEY),
  corsOrigins: parsed.data.API_CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean),
  initialAdminClerkUserIds: new Set(parsed.data.INITIAL_ADMIN_CLERK_USER_IDS.split(',').map((id) => id.trim()).filter(Boolean))
};

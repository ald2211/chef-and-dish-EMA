import { AppError } from '../../../shared/errors/app-error.js';
import type { UserRepository } from './user-repository.js';

export async function provisionDriver(clerkUserId: string, users: UserRepository): Promise<void> {
  const user = await users.createDriverIfMissing(clerkUserId);
  if (user.role !== 'DRIVER' || !user.active) {
    throw new AppError(409, 'ROLE_CONFLICT', 'This account already has a different role.');
  }
}

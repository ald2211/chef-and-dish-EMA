import { AppError } from '../../../shared/errors/app-error.js';
import type { UserRepository } from './user-repository.js';

export async function resolveIdentity(
  clerkUserId: string,
  initialAdminClerkUserIds: ReadonlySet<string>,
  users: UserRepository
) {
  const existing = await users.findByClerkUserId(clerkUserId);
  const user = existing ?? (initialAdminClerkUserIds.has(clerkUserId) ? await users.createInitialAdmin(clerkUserId) : null);

  if (!user || !user.active) {
    throw new AppError(403, 'USER_NOT_PROVISIONED', 'This account is not authorized to use the application.');
  }

  return user;
}

import type { IdentityUser } from '../domain/user.js';

export interface UserRepository {
  findByClerkUserId(clerkUserId: string): Promise<IdentityUser | null>;
  createInitialAdmin(clerkUserId: string): Promise<IdentityUser>;
  createDriverIfMissing(clerkUserId: string): Promise<IdentityUser>;
}

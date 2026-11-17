export const userRoles = ['ADMIN', 'DRIVER'] as const;
export type UserRole = (typeof userRoles)[number];

export interface IdentityUser {
  clerkUserId: string;
  role: UserRole;
  active: boolean;
}

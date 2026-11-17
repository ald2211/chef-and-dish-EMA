import type { UserRepository } from '../application/user-repository.js';
import type { IdentityUser } from '../domain/user.js';
import { UserModel } from './user-model.js';

export class MongooseUserRepository implements UserRepository {
  async findByClerkUserId(clerkUserId: string): Promise<IdentityUser | null> {
    return UserModel.findOne({ clerkUserId }).select({ clerkUserId: 1, role: 1, active: 1, _id: 0 }).lean<IdentityUser>().exec();
  }

  async createInitialAdmin(clerkUserId: string): Promise<IdentityUser> {
    const user = await UserModel.findOneAndUpdate(
      { clerkUserId },
      { $setOnInsert: { clerkUserId, role: 'ADMIN', active: true } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    ).select({ clerkUserId: 1, role: 1, active: 1, _id: 0 }).lean<IdentityUser>().exec();
    return user;
  }

  async createDriverIfMissing(clerkUserId: string): Promise<IdentityUser> {
    const user = await UserModel.findOneAndUpdate(
      { clerkUserId },
      { $setOnInsert: { clerkUserId, role: 'DRIVER', active: true } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    ).select({ clerkUserId: 1, role: 1, active: 1, _id: 0 }).lean<IdentityUser>().exec();
    return user;
  }
}

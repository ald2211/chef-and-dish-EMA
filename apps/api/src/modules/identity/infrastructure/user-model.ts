import { model, Schema } from 'mongoose';
import { userRoles, type IdentityUser } from '../domain/user.js';

const userSchema = new Schema<IdentityUser>({
  clerkUserId: { type: String, required: true, unique: true, immutable: true },
  role: { type: String, enum: userRoles, required: true },
  active: { type: Boolean, required: true, default: true }
}, { timestamps: true, versionKey: false });

export const UserModel = model<IdentityUser>('IdentityUser', userSchema);

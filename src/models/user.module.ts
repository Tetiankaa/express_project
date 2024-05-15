import { Schema } from "mongoose";
import * as mongoose from "mongoose";

import { EAccountType } from "../enums/account-type.enum";
import { ERole } from "../enums/role.enum";
import { IUser } from "../interfaces/user.interface";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    role: { type: String, enum: ERole, default: ERole.BUYER },
    accountType: {
      type: String,
      enum: EAccountType,
      default: EAccountType.BASIC,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = mongoose.model<IUser>("users", userSchema);

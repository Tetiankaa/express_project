import { Schema, Types } from "mongoose";
import * as mongoose from "mongoose";

import { IMissingBrandModel } from "../interfaces/missing-brand-model.interface";
import { User } from "./user.module";

const schemaUserSuggestions = new Schema(
  {
    _userId: { type: Types.ObjectId, ref: User, required: true },
    email: { type: String, required: true },
    fullName: { type: String },
    notes: { type: String },
    brand: { type: String, required: true },
    model: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

export const UserSuggestions = mongoose.model<IMissingBrandModel>(
  "user_suggestions",
  schemaUserSuggestions,
);

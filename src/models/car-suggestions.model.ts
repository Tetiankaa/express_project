import { Schema, Types } from "mongoose";
import * as mongoose from "mongoose";

import { IMissingBrandModel } from "../interfaces/missing-brand-model.interface";
import { User } from "./user.module";

const schemaCarSuggestions = new Schema(
  {
    _userId: { type: Types.ObjectId, ref: User, required: true },
    email: { type: String, required: true },
    fullName: { type: String },
    notes: { type: String },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    isResolved: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

export const CarSuggestions = mongoose.model<IMissingBrandModel>(
  "car_suggestions",
  schemaCarSuggestions,
);

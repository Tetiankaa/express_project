import { Schema, Types } from "mongoose";
import * as mongoose from "mongoose";

import { EActionTokenType } from "../enums/action-token-type.enum";
import { IActionToken } from "../interfaces/action-token.interface";
import { User } from "./user.module";

const actionTokenSchema = new Schema(
  {
    token: { type: String, required: true },
    user_id: { type: Types.ObjectId, ref: User, required: true },
    tokenType: { type: String, enum: EActionTokenType, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ActionToken = mongoose.model<IActionToken>(
  "action-tokens",
  actionTokenSchema,
);

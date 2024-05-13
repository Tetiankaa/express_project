import { Schema, Types } from "mongoose";
import * as mongoose from "mongoose";

import { ITokenDB } from "../interfaces/token.interface";
import { User } from "./user.module";

const tokenSchema = new Schema(
  {
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    _userId: { type: Types.ObjectId, required: true, ref: User },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Token = mongoose.model<ITokenDB>("tokens", tokenSchema);

import { Schema, Types } from "mongoose";
import * as mongoose from "mongoose";

import { config } from "../configs/config";
import { EPostStatus } from "../enums/post-status.enum";
import { IPostBasic } from "../interfaces/post.interface";
import { Car } from "./car.module";
import { User } from "./user.module";

const postSchema = new Schema(
  {
    user_id: { type: Types.ObjectId, ref: User, required: true },
    car_id: { type: Types.ObjectId, ref: Car, required: true },
    status: { type: String, enum: EPostStatus, required: true },
    profanityEdits: {
      type: Number,
      required: true,
      max: config.MAX_PROFANITY_EDITS,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const Post = mongoose.model<IPostBasic>("posts", postSchema);

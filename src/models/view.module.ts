import { Schema, Types } from "mongoose";
import * as mongoose from "mongoose";

import { IView } from "../interfaces/view.interface";
import { Post } from "./post.module";

const viewSchema = new Schema(
  {
    post_id: { type: Types.ObjectId, ref: Post, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const View = mongoose.model<IView>("post_views", viewSchema);

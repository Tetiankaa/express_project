import {Schema} from "mongoose";
import * as mongoose from "mongoose";
import { IBrandModels} from "../interfaces/brand.interface";

const modelSchema = new Schema({
    name: {type: String, required: true}
})
const brandSchema = new Schema({
    name: {type: String, required: true, unique: true},
    models:[modelSchema],
})

export const Brand = mongoose.model<IBrandModels>("brands", brandSchema);

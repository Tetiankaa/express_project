import { Schema } from "mongoose";
import * as mongoose from "mongoose";

import { ECurrency } from "../enums/currency.enum";
import { ICar } from "../interfaces/car.interface";

const carSchema = new Schema(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    region: { type: String, required: true },
    city: { type: String, required: true },
    color: { type: String, required: true },
    description: { type: String, required: true },
    photo: { type: String }, //TODO photo make required
    year: { type: Number, required: true },
    mileage: { type: Number, required: true },
    price: { type: Number, required: true },
    currency: { type: String, enum: ECurrency, required: true }, //TODO create DB
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Car = mongoose.model<ICar>("cars", carSchema);

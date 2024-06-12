import { Schema } from "mongoose";
import * as mongoose from "mongoose";

import { ECurrency } from "../enums/currency.enum";
import { ICar } from "../interfaces/car.interface";

const UAHSchema = new Schema({
  currency: { type: String, default: "UAH" },
  value: { type: Number, min: 0 },
});

const USDSchema = new Schema({
  currency: { type: String, default: "USD" },
  value: { type: Number, min: 0 },
});

const EURSchema = new Schema({
  currency: { type: String, default: "EUR" },
  value: { type: Number, min: 0 },
});

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
    enteredPrice: { type: Number, required: true },
    enteredCurrency: { type: String, enum: ECurrency, required: true },
    prices: [UAHSchema, EURSchema, USDSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Car = mongoose.model<ICar>("cars", carSchema);

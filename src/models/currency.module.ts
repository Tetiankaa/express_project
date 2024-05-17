import { Schema } from "mongoose";
import * as mongoose from "mongoose";

import { ICurrency } from "../interfaces/currency.interface";

const currencySchema = new Schema({
  value: { type: String },
});

export const Currency = mongoose.model<ICurrency>("currencies", currencySchema);

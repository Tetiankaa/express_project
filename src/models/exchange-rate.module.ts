import { Schema } from "mongoose";
import * as mongoose from "mongoose";

import { ECurrency } from "../enums/currency.enum";
import { IExchangeRate } from "../interfaces/exchange-rate.interface";

const exchangeRateSchema = new Schema(
  {
    ccy: { type: String, enum: ECurrency },
    base_ccy: { type: String },
    buy: { type: Number },
    sale: { type: Number },
  },
  { timestamps: true, versionKey: false },
);

export const ExchangeRate = mongoose.model<IExchangeRate>(
  "exchange_rates",
  exchangeRateSchema,
);

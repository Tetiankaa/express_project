import { FilterQuery } from "mongoose";

import { IExchangeRate } from "../interfaces/exchange-rate.interface";
import { ExchangeRate } from "../models/exchange-rate.module";

class ExchangeRateRepository {
  public async save(rate: IExchangeRate): Promise<IExchangeRate> {
    return await ExchangeRate.create(rate);
  }
  public async findBy(
    filter: FilterQuery<IExchangeRate>,
  ): Promise<IExchangeRate> {
    return await ExchangeRate.findOne(filter);
  }
  public async deleteMany(): Promise<void> {
    await ExchangeRate.deleteMany({});
  }
}

export const exchangeRateRepository = new ExchangeRateRepository();

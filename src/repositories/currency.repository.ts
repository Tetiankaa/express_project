import { ICurrency } from "../interfaces/currency.interface";
import { Currency } from "../models/currency.module";

class CurrencyRepository {
  public async getAll(): Promise<ICurrency[]> {
    return await Currency.find();
  }
}

export const currencyRepository = new CurrencyRepository();

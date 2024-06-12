import axios from "axios";

import { config } from "../configs/config";
import { IExchangeRateAPI } from "../interfaces/exchange-rate.interface";

class ExchangeRateService {
  public async getExchangeRates(): Promise<IExchangeRateAPI[]> {
    try {
      const { data } = await axios.get(config.API_PRIVATBANK);
      return data;
    } catch (e) {
      throw new Error("Could not fetch exchange rates");
    }
  }
}

export const exchangeRateService = new ExchangeRateService();

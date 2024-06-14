import axios from "axios";

import { config } from "../configs/config";
import { errorMessages } from "../constants/error-messages.constant";
import { statusCode } from "../constants/status-codes.constant";
import { ApiError } from "../errors/api-error";
import { IExchangeRateAPI } from "../interfaces/exchange-rate.interface";

class ExchangeRateService {
  public async getExchangeRates(): Promise<IExchangeRateAPI[]> {
    try {
      const { data } = await axios.get(config.API_PRIVATBANK);
      return data;
    } catch (e) {
      throw new ApiError(
        statusCode.SERVICE_UNAVAILABLE,
        errorMessages.CANNOT_FETCH_EXCHANGE_RATES,
      );
    }
  }
}

export const exchangeRateService = new ExchangeRateService();

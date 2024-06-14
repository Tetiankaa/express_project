import { errorMessages } from "../constants/error-messages.constant";
import { statusCode } from "../constants/status-codes.constant";
import { ECurrency } from "../enums/currency.enum";
import { ApiError } from "../errors/api-error";
import { IExchangeRate } from "../interfaces/exchange-rate.interface";
import { IPrice } from "../interfaces/price.interface";
import { exchangeRateRepository } from "../repositories/exchange-rate.repository";

class CurrencyService {
  public async getExchangeRates(): Promise<{
    rates: { usd: IExchangeRate; eur: IExchangeRate };
  }> {
    const usd = await exchangeRateRepository.findBy({
      ccy: ECurrency.USD,
    });
    const eur = await exchangeRateRepository.findBy({
      ccy: ECurrency.EUR,
    });

    return {
      rates: {
        usd,
        eur,
      },
    };
  }

  public async calculatePrices(
    enteredPrice: number,
    enteredCurrency: ECurrency,
    usdRate: IExchangeRate,
    eurRate: IExchangeRate,
  ): Promise<IPrice[]> {
    try {
      let uah: IPrice;
      let eur: IPrice;
      let usd: IPrice;
      switch (enteredCurrency) {
        case ECurrency.UAH:
          uah = { value: +enteredPrice.toFixed(2), currency: ECurrency.UAH };
          eur = {
            value: +(enteredPrice / eurRate.sale).toFixed(2),
            currency: ECurrency.EUR,
          };
          usd = {
            value: +(enteredPrice / usdRate.sale).toFixed(2),
            currency: ECurrency.USD,
          };
          break;
        case ECurrency.EUR:
          eur = { value: +enteredPrice.toFixed(2), currency: ECurrency.EUR };
          uah = {
            value: +(enteredPrice * eurRate.buy).toFixed(2),
            currency: ECurrency.UAH,
          };
          usd = {
            value: +((enteredPrice * eurRate.buy) / usdRate.sale).toFixed(2),
            currency: ECurrency.USD,
          };
          break;
        case ECurrency.USD:
          usd = { value: +enteredPrice.toFixed(2), currency: ECurrency.USD };
          uah = {
            value: +(enteredPrice * usdRate.buy).toFixed(2),
            currency: ECurrency.UAH,
          };
          eur = {
            value: +((enteredPrice * usdRate.buy) / eurRate.sale).toFixed(2),
            currency: ECurrency.EUR,
          };
          break;
        default:
          throw new ApiError(
            statusCode.BAD_REQUEST,
            errorMessages.INVALID_CURRENCY_TYPE,
          );
      }
      return [{ ...eur }, { ...usd }, { ...uah }];
    } catch (e) {
      throw new ApiError(
        statusCode.INTERNAL_SERVER_ERROR,
        errorMessages.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const currencyService = new CurrencyService();

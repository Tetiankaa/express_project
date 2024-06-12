import { CronJob } from "cron";

import { exchangeRateRepository } from "../repositories/exchange-rate.repository";
import { exchangeRateService } from "../services/exchange-rate.service";

const handler = async () => {
  try {
    await exchangeRateRepository.deleteMany();
    const rates = await exchangeRateService.getExchangeRates();

    await Promise.all(
      rates.map((rate) => {
        const buy = +parseFloat(rate.buy).toFixed(2);
        const sale = +parseFloat(rate.sale).toFixed(2);

        exchangeRateRepository.save({ ...rate, buy, sale });
      }),
    );
  } catch (e) {
    console.error("Error saving exchange rates:", e);
  }
};

export const fetchExchangeRate = new CronJob("* * 8 * * * ", handler);

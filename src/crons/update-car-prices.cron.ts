import { CronJob } from "cron";

import { config } from "../configs/config";
import { carRepository } from "../repositories/car.repository";
import { postRepository } from "../repositories/post.repository";
import { currencyService } from "../services/currency.service";

const BATCH_SIZE = config.BATCH_SIZE || 50;

const handler = async () => {
  const start = Date.now();
  try {
    console.log("updating car prices started: " + start);
    const carIds = await postRepository.getCarIds({ isDeleted: false });
    const {
      rates: { usd, eur },
    } = await currencyService.getExchangeRates();

    for (let i = 0; i < carIds.length; i += BATCH_SIZE) {
      const batchIds = carIds.slice(i, Math.min(i + BATCH_SIZE, carIds.length));
      await Promise.all(
        batchIds.map(async (carId) => {
          const { enteredPrice, enteredCurrency } =
            await carRepository.getById(carId);
          const prices = await currencyService.calculatePrices(
            enteredPrice,
            enteredCurrency,
            usd,
            eur,
          );
          await carRepository.updateById(carId, { prices });
        }),
      );
    }
  } catch (e) {
    console.error("Error updating car prices: " + e);
  } finally {
    const end = Date.now();
    console.log("updating car prices ended: " + end);
    console.log(`Taking time: ${end - start}ms`);
  }
};
export const updateCarPrices = new CronJob("* 5 8 * * *", handler);

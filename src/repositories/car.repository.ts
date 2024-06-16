import { FilterQuery, PipelineStage } from "mongoose";

import { ECurrency } from "../enums/currency.enum";
import { ICar } from "../interfaces/car.interface";
import { Car } from "../models/car.module";

class CarRepository {
  public async create(car: Partial<ICar>): Promise<ICar> {
    return await Car.create(car);
  }
  public async getAll(): Promise<ICar[]> {
    return await Car.find();
  }

  public async getById(carId: string): Promise<ICar> {
    return await Car.findOne({ _id: carId });
  }
  public async getByParams(params: FilterQuery<ICar>): Promise<ICar> {
    return await Car.findOne(params);
  }
  public async deleteById(carId: string): Promise<void> {
    await Car.findOneAndDelete({ _id: carId });
  }

  public async updateById(carId: string, car: Partial<ICar>): Promise<ICar> {
    return await Car.findOneAndUpdate({ _id: carId }, car, {
      returnDocument: "after",
    });
  }
  public async getAveragePrice(currency: ECurrency): Promise<number> {
    const pipeline: PipelineStage[] = [
      {
        $unwind: "$prices",
      },
      {
        $match: {
          "prices.currency": currency,
        },
      },
      {
        $group: {
          _id: null,
          avgPrice: {
            $avg: "$prices.value",
          },
        },
      },
    ];

    const result = await Car.aggregate(pipeline);
    if (result.length > 0 && result[0].avgPrice !== null) {
      return result[0].avgPrice;
    } else {
      return 0;
    }
  }
  public async getAveragePriceByRegion(
    region: string,
    currency: ECurrency,
  ): Promise<number> {
    const pipeline: PipelineStage[] = [
      {
        $unwind: "$prices",
      },
      {
        $match: {
          "prices.currency": currency,
          region: region,
        },
      },
      {
        $group: {
          _id: null,
          avgPriceByRegion: {
            $avg: "$prices.value",
          },
        },
      },
    ];

    const result = await Car.aggregate(pipeline);
    console.log(result);
    if (result.length > 0 && result[0].avgPriceByRegion !== null) {
      return result[0].avgPriceByRegion;
    } else {
      return 0;
    }
  }
}

export const carRepository = new CarRepository();

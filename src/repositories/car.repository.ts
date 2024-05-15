import { FilterQuery } from "mongoose";

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
}

export const carRepository = new CarRepository();

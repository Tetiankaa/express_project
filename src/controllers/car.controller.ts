import { NextFunction, Request, Response } from "express";

import { statusCode } from "../constants/status-codes.constant";
import { ICar } from "../interfaces/car.interface";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { CarMapper } from "../mappers/car.mapper";
import { carService } from "../services/car.service";

class CarController {
  public async saveCar(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJwtPayload;
      const carToSave = req.body as Partial<ICar>;
      const carResponse = await carService.saveCar(carToSave, jwtPayload);
      const response = CarMapper.toResponseDto(carResponse);
      res.status(statusCode.CREATED).json(response);
      next();
    } catch (e) {
      next(e);
    }
  }
  public async getCurrencies(req: Request, res: Response, next: NextFunction) {
    try {
      const currencies = await carService.getCurrencies();
      res.json(currencies);
    } catch (e) {
      next(e);
    }
  }
}

export const carController = new CarController();

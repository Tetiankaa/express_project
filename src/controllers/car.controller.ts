import { NextFunction, Request, Response } from "express";

import { statusCode } from "../constants/status-codes.constant";
import { IBrandModelInput } from "../interfaces/brand-model-input.interface";
import { ICar } from "../interfaces/car.interface";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { IMissingBrandModel } from "../interfaces/missing-brand-model.interface";
import { ITokenDB } from "../interfaces/token.interface";
import { CarMapper } from "../mappers/car.mapper";
import { carService } from "../services/car.service";

class CarController {
  public async saveCar(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJwtPayload;
      const { _id } = req.res.locals.tokenPair as ITokenDB;
      const carToSave = req.body as Partial<ICar>;
      const carResponse = await carService.saveCar(carToSave, jwtPayload, _id);
      const response = CarMapper.toResponseDto(
        carResponse.data,
        carResponse.tokens,
      );
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
  public async getBrands(req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await carService.getBrands();
      res.json(brands);
    } catch (e) {
      next(e);
    }
  }
  public async reportMissingBrandModel(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const body = req.body as IMissingBrandModel;
      const { _userId } = req.res.locals.jwtPayload as IJwtPayload;
      const response = await carService.reportMissingBrandModel(body, _userId);
      res.status(statusCode.CREATED).send(response);
    } catch (e) {
      next(e);
    }
  }
  public async createBrandOrModel(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const body = req.body as IBrandModelInput;
      const response = await carService.createBrandOrModel(body);
      res.status(statusCode.CREATED).json(response);
    } catch (e) {
      next(e);
    }
  }
}

export const carController = new CarController();

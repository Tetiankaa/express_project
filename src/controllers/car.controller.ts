import { NextFunction, Request, Response } from "express";

import { statusCode } from "../constants/status-codes.constant";
import { IBrandModelInput } from "../interfaces/brand-model-input.interface";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { IMissingBrandModel } from "../interfaces/missing-brand-model.interface";
import { IQuery } from "../interfaces/query.interface";
import { CarSuggestionMapper } from "../mappers/car-suggestion.mapper";
import { carService } from "../services/car.service";

class CarController {
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
  public async getCarSuggestions(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = req.query as IQuery;
      const carSuggestions = await carService.getCarSuggestions(query);
      const response = CarSuggestionMapper.toResponseListDto(carSuggestions);
      res.json(response);
      next();
    } catch (e) {
      next(e);
    }
  }
  public async getCarSuggestion(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = req.params.id;
      const carSuggestion = await carService.getCarSuggestion(id);
      const response = CarSuggestionMapper.toDto(carSuggestion);
      res.json(response);
      next();
    } catch (e) {
      next(e);
    }
  }
  public async toggleCarSuggestionResolution(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = req.params.id;
      const carSuggestion = await carService.toggleCarSuggestionResolution(id);
      const response = CarSuggestionMapper.toDto(carSuggestion);
      res.json(response);
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const carController = new CarController();

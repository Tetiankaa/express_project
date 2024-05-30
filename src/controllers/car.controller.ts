import { NextFunction, Request, Response } from "express";

import { statusCode } from "../constants/status-codes.constant";
import { IBrandModelInput } from "../interfaces/brand-model-input.interface";
import { ICar, ICarDto } from "../interfaces/car.interface";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { IMissingBrandModel } from "../interfaces/missing-brand-model.interface";
import { IPostWithCarAndUser } from "../interfaces/post.interface";
import { IQuery } from "../interfaces/query.interface";
import { ITokenDB, ITokenResponse } from "../interfaces/token.interface";
import { IUserDTO } from "../interfaces/user.interface";
import { CarSuggestionMapper } from "../mappers/car-suggestion.mapper";
import { PostMapper } from "../mappers/post.mapper";
import { carService } from "../services/car.service";

class CarController {
  public async saveCar(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJwtPayload;
      const { _id } = req.res.locals.tokenPair as ITokenDB;
      const carToSave = req.body as Partial<ICar>;
      const savedPost = await carService.saveCar(carToSave, jwtPayload, _id);
      const response: {
        data: IPostWithCarAndUser<ICarDto, IUserDTO>;
        tokens?: ITokenResponse;
      } = {
        data: PostMapper.toPrivatePost(savedPost.data),
        tokens: savedPost.tokens,
      };
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

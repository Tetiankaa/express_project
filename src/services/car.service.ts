import { errorMessages } from "../constants/error-messages.constant";
import { statusCode } from "../constants/status-codes.constant";
import { EAccountType } from "../enums/account-type.enum";
import { EEmailType } from "../enums/email-type.enum";
import { EPostStatus } from "../enums/post-status.enum";
import { ERole } from "../enums/role.enum";
import { ApiError } from "../errors/api-error";
import { IBrandModels } from "../interfaces/brand.interface";
import { IBrandModelInput } from "../interfaces/brand-model-input.interface";
import { ICar, ICarResponse } from "../interfaces/car.interface";
import { ICurrency } from "../interfaces/currency.interface";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { IMissingBrandModel } from "../interfaces/missing-brand-model.interface";
import { ITokenResponse } from "../interfaces/token.interface";
import { brandRepository } from "../repositories/brand.repository";
import { carRepository } from "../repositories/car.repository";
import { carSuggestionsRepository } from "../repositories/car-suggestions.repository";
import { currencyRepository } from "../repositories/currency.repository";
import { postRepository } from "../repositories/post.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { authService } from "./auth.service";
import { emailService } from "./email.service";
import {IQuery} from "../interfaces/query.interface";
import {IListResponse} from "../interfaces/list-response.interface";

class CarService {
  public async saveCar(
    car: Partial<ICar>,
    jwtPayload: IJwtPayload,
    oldTokenId: string,
  ): Promise<{ data: ICarResponse; tokens?: ITokenResponse }> {
    const postsCount = await postRepository.countDocumentsByParams({
      user_id: jwtPayload._userId,
    });

    if (jwtPayload.accountType === EAccountType.BASIC && postsCount >= 1) {
      throw new ApiError(
        statusCode.FORBIDDEN,
        errorMessages.ONE_POST_FOR_BASIC_ACCOUNT,
      );
    }
    // TODO check profanity
    const savedCar = await carRepository.create(car);
    const post = await postRepository.create({
      user_id: jwtPayload._userId,
      car_id: savedCar._id,
      profanityEdits: 0,
      status: EPostStatus.ACTIVE,
    });
    let tokens: ITokenResponse;
    if (postsCount === 0 && jwtPayload.role === ERole.BUYER) {
      const user = await userRepository.updateById(jwtPayload._userId, {
        role: ERole.SELLER,
      });
      await tokenRepository.deleteById(oldTokenId);
      tokens = await authService.generateTokens(user);
    }

    return {
      data: {
        car: savedCar,
        profanityEdits: post.profanityEdits,
        status: post.status,
      },
      tokens,
    };
  }
  public async getCurrencies(): Promise<{ data: ICurrency[] }> {
    const currencies = await currencyRepository.getAll();
    return {
      data: currencies,
    };
  }

  public async getBrands(): Promise<IBrandModels[]> {
    return await brandRepository.getAll();
  }
  public async reportMissingBrandModel(
    report: IMissingBrandModel,
    userId: string,
  ): Promise<IMissingBrandModel> {
    const user = await userRepository.getById(userId);
    if (user.email != report.email) {
      throw new ApiError(
        statusCode.BAD_REQUEST,
        errorMessages.NOT_AUTHENTICATED_EMAIL,
      );
    }

    const suggestion = await carSuggestionsRepository.create({
      ...report,
      _userId: userId,
    });
    await emailService.sendByEmailType(EEmailType.MISSING_BRAND_MODEL, {
      ...report,
    });
    return suggestion;
  }
  public async createBrandOrModel(
    data: IBrandModelInput,
  ): Promise<IBrandModels> {
    const { brand, model } = data;
    const isBrandAndModelExist = await brandRepository.findByParams({
      brand,
      model,
    });

    if (isBrandAndModelExist) {
      throw new ApiError(
        statusCode.BAD_REQUEST,
        errorMessages.BRAND_MODEL_ALREADY_EXIST,
      );
    }

    const existingBrand = await brandRepository.findByParams({ brand });

    if (existingBrand) {
      existingBrand.models.push({ name: model });
      return await brandRepository.updateById(existingBrand._id, existingBrand);
    } else {
      return await brandRepository.create({
        name: brand,
        models: [{ name: model }],
      });
    }
  }
  public async getCarSuggestions(query: IQuery):Promise<IListResponse<IMissingBrandModel>> {
    return await carSuggestionsRepository.getAll(query);
  }
}

export const carService = new CarService();

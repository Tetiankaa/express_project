import { config } from "../configs/config";
import { errorMessages } from "../constants/error-messages.constant";
import { statusCode } from "../constants/status-codes.constant";
import { EAccountType } from "../enums/account-type.enum";
import { EEmailType } from "../enums/email-type.enum";
import { EPostStatus } from "../enums/post-status.enum";
import { ERole } from "../enums/role.enum";
import { ApiError } from "../errors/api-error";
import { IBrandModels } from "../interfaces/brand.interface";
import { IBrandModelInput } from "../interfaces/brand-model-input.interface";
import { ICar } from "../interfaces/car.interface";
import { ICurrency } from "../interfaces/currency.interface";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { IListResponse } from "../interfaces/list-response.interface";
import { IMissingBrandModel } from "../interfaces/missing-brand-model.interface";
import { IPostWithCarAndUser } from "../interfaces/post.interface";
import { IQuery } from "../interfaces/query.interface";
import { ITokenResponse } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { brandRepository } from "../repositories/brand.repository";
import { carRepository } from "../repositories/car.repository";
import { carSuggestionsRepository } from "../repositories/car-suggestions.repository";
import { currencyRepository } from "../repositories/currency.repository";
import { postRepository } from "../repositories/post.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { authService } from "./auth.service";
import { emailService } from "./email.service";
import { profanityService } from "./profanity.service";

class CarService {
  public async saveCar(
    car: Partial<ICar>,
    jwtPayload: IJwtPayload,
    oldTokenId: string,
  ): Promise<{
    data: IPostWithCarAndUser<ICar, IUser>;
    tokens?: ITokenResponse;
  }> {
    const postsCount = await postRepository.countDocumentsByParams({
      user_id: jwtPayload._userId,
    });

    if (jwtPayload.accountType === EAccountType.BASIC && postsCount >= 1) {
      throw new ApiError(
        statusCode.FORBIDDEN,
        errorMessages.ONE_POST_FOR_BASIC_ACCOUNT,
      );
    }
    const isProfanityPresent = profanityService.checkForProfanity(car);

    const savedCar = await carRepository.create(car);
    const post = await postRepository.create({
      user_id: jwtPayload._userId,
      car_id: savedCar._id,
      profanityEdits: 0,
      status: isProfanityPresent ? EPostStatus.NOT_ACTIVE : EPostStatus.ACTIVE,
    });
    const user = await userRepository.getById(jwtPayload._userId);

    let tokens: ITokenResponse;
    if (postsCount === 0 && jwtPayload.role === ERole.BUYER) {
      const user = await userRepository.updateById(jwtPayload._userId, {
        role: ERole.SELLER,
      });
      await tokenRepository.deleteById(oldTokenId);
      tokens = await authService.generateTokens(user);
    }
    if (isProfanityPresent) {
      await emailService.sendByEmailType(
        EEmailType.POST_PROFANITY_DETECTED,
        {
          firstName: user.firstName,
          numberOfAttempts: config.MAX_PROFANITY_EDITS,
        },
        false,
        user.email,
      );
    }

    return {
      data: {
        car: savedCar,
        user,
        status: post.status,
        profanityEdits: post.profanityEdits,
        isDeleted: post.isDeleted,
        _id: post._id,
        createdAt: post.createdAt,
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
    await emailService.sendByEmailType(
      EEmailType.MISSING_BRAND_MODEL,
      {
        ...report,
      },
      true,
    );
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
  public async getCarSuggestions(
    query: IQuery,
  ): Promise<IListResponse<IMissingBrandModel>> {
    return await carSuggestionsRepository.getAll(query);
  }
  public async getCarSuggestion(id: string): Promise<IMissingBrandModel> {
    return await this.findCarSuggestionOrThrow(id);
  }
  public async toggleCarSuggestionResolution(
    id: string,
  ): Promise<IMissingBrandModel> {
    const carSuggestion = await this.findCarSuggestionOrThrow(id);
    const wasResolved = carSuggestion.isResolved;

    const updatedSuggestion = await carSuggestionsRepository.updateById(id, {
      isResolved: !carSuggestion.isResolved,
    });

    if (!wasResolved && updatedSuggestion.isResolved) {
      await emailService.sendByEmailType(
        EEmailType.MISSING_BRAND_MODEL_ADDED,
        {
          ...updatedSuggestion,
        },
        false,
        updatedSuggestion.email,
      );
    }
    return updatedSuggestion;
  }

  private async findCarSuggestionOrThrow(
    id: string,
  ): Promise<IMissingBrandModel> {
    const record = await carSuggestionsRepository.getById(id);
    if (!record) {
      throw new ApiError(
        statusCode.NOT_FOUND,
        errorMessages.CAR_SUGGESTION_NOT_FOUND,
      );
    }
    return record;
  }
}

export const carService = new CarService();

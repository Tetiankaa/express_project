import { config } from "../configs/config";
import { errorMessages } from "../constants/error-messages.constant";
import { statusCode } from "../constants/status-codes.constant";
import { EEmailType } from "../enums/email-type.enum";
import { ApiError } from "../errors/api-error";
import { IBrandModels } from "../interfaces/brand.interface";
import { IBrandModelInput } from "../interfaces/brand-model-input.interface";
import { ICurrency } from "../interfaces/currency.interface";
import { IListResponse } from "../interfaces/list-response.interface";
import { IMissingBrandModel } from "../interfaces/missing-brand-model.interface";
import { IQuery } from "../interfaces/query.interface";
import { brandRepository } from "../repositories/brand.repository";
import { carSuggestionsRepository } from "../repositories/car-suggestions.repository";
import { currencyRepository } from "../repositories/currency.repository";
import { userRepository } from "../repositories/user.repository";
import { emailService } from "./email.service";

class CarService {
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
      config.ADMIN_EMAIL,
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

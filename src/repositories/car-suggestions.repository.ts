import { FilterQuery } from "mongoose";

import { IListResponse } from "../interfaces/list-response.interface";
import { IMissingBrandModel } from "../interfaces/missing-brand-model.interface";
import { IQuery } from "../interfaces/query.interface";
import { CarSuggestions } from "../models/car-suggestions.model";

class CarSuggestionsRepository {
  public async create(data: IMissingBrandModel): Promise<IMissingBrandModel> {
    return await CarSuggestions.create(data);
  }
  public async getAll(
    query?: IQuery,
  ): Promise<IListResponse<IMissingBrandModel>> {
    const { page = 1, limit = 20 } = query;
    const skip: number = (page - 1) * limit;
    const filterObj: FilterQuery<IMissingBrandModel> = {};

    if (query.isResolved) {
      filterObj.isResolved = query.isResolved;
    }

    const suggestions = await CarSuggestions.find(filterObj).skip(skip);

    const total = await CarSuggestions.countDocuments(filterObj);

    return {
      data: suggestions,
      limit: +limit,
      page: +page,
      total,
    };
  }
  public async getById(id: string): Promise<IMissingBrandModel> {
    return await CarSuggestions.findOne({ _id: id });
  }
  public async updateById(
    id: string,
    data: Partial<IMissingBrandModel>,
  ): Promise<IMissingBrandModel> {
    return await CarSuggestions.findOneAndUpdate({ _id: id }, data, {
      returnDocument: "after",
    });
  }
  public async deleteByParams(
    params: FilterQuery<IMissingBrandModel>,
  ): Promise<void> {
     await CarSuggestions.deleteMany(params);
  }
}

export const carSuggestionsRepository = new CarSuggestionsRepository();

import { FilterQuery } from "mongoose";

import { IBrandModels } from "../interfaces/brand.interface";
import { IBrandModelInput } from "../interfaces/brand-model-input.interface";
import { Brand } from "../models/brand.module";

class BrandRepository {
  public async getAll(): Promise<IBrandModels[]> {
    return await Brand.find();
  }
  public async findByParams(
    params: FilterQuery<IBrandModelInput>,
  ): Promise<IBrandModels> {
    const filterObj: FilterQuery<IBrandModels> = {};
    if (params.brand) {
      filterObj.name = { $regex: new RegExp(params.brand, "i") };
    }

    if (params.model) {
      filterObj["models.name"] = {
        $regex: new RegExp(params.model, "i"),
      };
    }
    return await Brand.findOne(filterObj);
  }
  public async create(data: Partial<IBrandModels>): Promise<IBrandModels> {
    return await Brand.create(data);
  }
  public async updateById(
    brandId: string,
    data: Partial<IBrandModels>,
  ): Promise<IBrandModels> {
    return await Brand.findOneAndUpdate({ _id: brandId }, data, {
      returnDocument: "after",
    });
  }
}

export const brandRepository = new BrandRepository();

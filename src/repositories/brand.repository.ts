import { IBrandModels } from "../interfaces/brand.interface";
import { Brand } from "../models/brand.module";

class BrandRepository {
  public async getAll(): Promise<IBrandModels[]> {
    return await Brand.find();
  }
}

export const brandRepository = new BrandRepository();

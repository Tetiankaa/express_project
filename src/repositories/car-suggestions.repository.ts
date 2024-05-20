import { IMissingBrandModel } from "../interfaces/missing-brand-model.interface";
import { CarSuggestions } from "../models/car-suggestions.model";

class CarSuggestionsRepository {
  public async create(data: IMissingBrandModel): Promise<IMissingBrandModel> {
    return await CarSuggestions.create(data);
  }
}

export const carSuggestionsRepository = new CarSuggestionsRepository();

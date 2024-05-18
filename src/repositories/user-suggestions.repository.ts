import { IMissingBrandModel } from "../interfaces/missing-brand-model.interface";
import { UserSuggestions } from "../models/user-suggestions.model";

class UserSuggestionsRepository {
  public async create(data: IMissingBrandModel): Promise<IMissingBrandModel> {
    return await UserSuggestions.create(data);
  }
}

export const userSuggestionsRepository = new UserSuggestionsRepository();

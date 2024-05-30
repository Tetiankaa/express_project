import { IListResponse } from "../interfaces/list-response.interface";
import {
  IMissingBrandModel,
  IMissingBrandModelDto,
} from "../interfaces/missing-brand-model.interface";

export class CarSuggestionMapper {
  public static toDto(
    carSuggestion: IMissingBrandModel,
  ): IMissingBrandModelDto {
    return {
      _id: carSuggestion._id,
      _userId: carSuggestion._userId,
      brand: carSuggestion.brand,
      createdAt: carSuggestion.createdAt,
      updatedAt: carSuggestion.updatedAt,
      model: carSuggestion.model,
      email: carSuggestion.email,
      fullName: carSuggestion.fullName,
      notes: carSuggestion.notes,
      isResolved: carSuggestion.isResolved,
    };
  }

  public static toResponseListDto(
    data: IListResponse<IMissingBrandModel>,
  ): IListResponse<IMissingBrandModelDto> {
    const transformedData = data.data.map((value) => this.toDto(value));
    return {
      total: data.total,
      limit: data.limit,
      page: data.page,
      data: transformedData,
    };
  }
}

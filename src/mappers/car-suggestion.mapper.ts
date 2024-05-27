import {IMissingBrandModel, IMissingBrandModelDto} from "../interfaces/missing-brand-model.interface";
import {IListResponse} from "../interfaces/list-response.interface";

export class CarSuggestionMapper {
    public static toDto(carSuggestion: IMissingBrandModel): IMissingBrandModelDto {
        return {
            _userId: carSuggestion._userId,
            brand: carSuggestion.brand,
            createdAt: carSuggestion.createdAt,
            model: carSuggestion.model,
            email: carSuggestion.email,
            fullName: carSuggestion.fullName,
            notes: carSuggestion.notes,
            isResolved: carSuggestion.isResolved
        }
    }

    public static toResponseListDto(
        data: IListResponse<IMissingBrandModel>,
    ): IListResponse<IMissingBrandModelDto> {
        const transformedData = data.data.map(value => this.toDto(value))
        return {
            total: data.total,
            limit: data.limit,
            page: data.page,
            data: transformedData,
        };
    }
}

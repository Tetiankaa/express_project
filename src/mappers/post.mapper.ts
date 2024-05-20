import {
  IPostResponse,
  IPostWithCar,
  IPostWithCarDto,
} from "../interfaces/post.interface";
import { CarMapper } from "./car.mapper";

export class PostMapper {
  public static toPostsWithCarResponse(
    data: IPostResponse<IPostWithCar>,
  ): IPostResponse<IPostWithCarDto> {
    const transformedData = data.data.map((post) => ({
      ...post,
      car: CarMapper.toDto(post.car),
    }));
    return {
      total: data.total,
      limit: data.limit,
      page: data.page,
      data: transformedData,
    };
  }
}

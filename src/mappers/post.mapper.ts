import { ICar, ICarDto } from "../interfaces/car.interface";
import { IListResponse } from "../interfaces/list-response.interface";
import { IPostWithCarAndUser } from "../interfaces/post.interface";
import { IUser, IUserDTO } from "../interfaces/user.interface";
import { CarMapper } from "./car.mapper";
import { UserMapper } from "./user.mapper";

export class PostMapper {
  public static toPublicResponseList(
    data: IListResponse<IPostWithCarAndUser<ICar, IUser>>,
  ): IListResponse<IPostWithCarAndUser<ICarDto, IUserDTO>> {
    const transformedData = data.data.map((post) => this.toPublicPost(post));
    return {
      total: data.total,
      limit: data.limit,
      page: data.page,
      data: transformedData,
    };
  }
  public static toPrivateResponseList(
    data: IListResponse<IPostWithCarAndUser<ICar, IUser>>,
  ): IListResponse<IPostWithCarAndUser<ICarDto, IUserDTO>> {
    const transformedData = data.data.map((post) => this.toPrivatePost(post));
    return {
      total: data.total,
      limit: data.limit,
      page: data.page,
      data: transformedData,
    };
  }
  public static toPrivatePost(
    post: IPostWithCarAndUser<ICar, IUser>,
  ): IPostWithCarAndUser<ICarDto, IUserDTO> {
    return {
      _id: post._id,
      user_id: post.user_id,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      profanityEdits: post.profanityEdits,
      status: post.status,
      isDeleted: post.isDeleted,
      car: CarMapper.toDto(post.car),
      user: UserMapper.toPrivateDto(post.user),
    };
  }
  public static toPublicPost(
    post: IPostWithCarAndUser<ICar, IUser>,
  ): IPostWithCarAndUser<ICarDto, IUserDTO> {
    return {
      _id: post._id,
      user_id: post.user_id,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      car: CarMapper.toDto(post.car),
      user: UserMapper.toPublicDto(post.user),
    };
  }
}

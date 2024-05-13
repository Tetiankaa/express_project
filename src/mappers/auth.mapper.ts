import { IAuthResponse } from "../interfaces/auth.interface";
import { ITokenResponse } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { UserMapper } from "./user.mapper";

export class AuthMapper {
  public static toAuthResponseDto(data: {
    tokens: ITokenResponse;
    user: IUser;
  }): IAuthResponse {
    return {
      tokens: data.tokens,
      user: UserMapper.toDto(data.user),
    };
  }
}

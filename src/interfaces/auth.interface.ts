import { ITokenResponse } from "./token.interface";
import { IUserDTO } from "./user.interface";

export interface IAuthResponse {
  tokens: ITokenResponse;
  user: IUserDTO;
}
export interface IAuthCredentials {
  email: string;
  password: string;
}

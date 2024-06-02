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
export interface ISetPassword extends Pick<IAuthCredentials, "password"> {}
export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}
export interface IForgotPassword extends Pick<IAuthCredentials, "email"> {}

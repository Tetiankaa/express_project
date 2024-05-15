export interface IToken {
  accessToken: string;
  refreshToken: string;
}
export interface ITokenResponse extends IToken {
  accessExpiresIn: string;
  refreshExpiresIn: string;
}
export interface ITokenDB extends IToken {
  _userId: string;
  _id?: string;
}

import * as jsonwebtoken from "jsonwebtoken";

import { config } from "../configs/config";
import { JwtPayloadInterface } from "../interfaces/jwt-payload.interface";
import { ITokenResponse } from "../interfaces/token.interface";

class TokenService {
  public generateTokenPair(payload: JwtPayloadInterface): ITokenResponse {
    const accessToken = jsonwebtoken.sign(payload, config.ACCESS_TOKEN_SECRET, {
      expiresIn: config.ACCESS_TOKEN_EXPIRES_IN,
    });
    const refreshToken = jsonwebtoken.sign(
      payload,
      config.REFRESH_TOKEN_SECRET,
      { expiresIn: config.REFRESH_TOKEN_EXPIRES_IN },
    );
    return {
      accessToken,
      refreshToken,
      accessExpiresIn: config.ACCESS_TOKEN_EXPIRES_IN,
      refreshExpiresIn: config.REFRESH_TOKEN_EXPIRES_IN,
    };
  }
}

export const tokenService = new TokenService();

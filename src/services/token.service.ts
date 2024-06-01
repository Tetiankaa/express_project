import * as jsonwebtoken from "jsonwebtoken";

import { config } from "../configs/config";
import { errorMessages } from "../constants/error-messages.constant";
import { statusCode } from "../constants/status-codes.constant";
import { EActionTokenType } from "../enums/action-token-type.enum";
import { ETokenType } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { ITokenResponse } from "../interfaces/token.interface";

class TokenService {
  public generateTokenPair(payload: IJwtPayload): ITokenResponse {
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
  public verifyToken(token: string, type: ETokenType): IJwtPayload {
    try {
      let secret: string;

      switch (type) {
        case ETokenType.ACCESS:
          secret = config.ACCESS_TOKEN_SECRET;
          break;
        case ETokenType.REFRESH:
          secret = config.REFRESH_TOKEN_SECRET;
          break;
        default:
          throw new ApiError(
            statusCode.UNAUTHORIZED,
            errorMessages.WRONG_TOKEN_TYPE,
          );
      }
      return jsonwebtoken.verify(token, secret) as IJwtPayload;
    } catch (error) {
      throw new ApiError(statusCode.UNAUTHORIZED, errorMessages.INVALID_TOKEN);
    }
  }
  public generateActionToken(
    payload: IJwtPayload,
    tokenType: EActionTokenType,
  ): string {
    try {
      let secret: string;
      let expiresIn: string;

      switch (tokenType) {
        case EActionTokenType.SETUP_MANAGER:
          secret = config.ACTION_TOKEN_SETUP_MANAGER_SECRET;
          expiresIn = config.ACTION_TOKEN_SETUP_MANAGER_EXPIRES_IN;
          break;
        case EActionTokenType.FORGOT_PASSWORD:
          secret = config.ACTION_TOKEN_FORGOT_PASSWORD_SECRET;
          expiresIn = config.ACTION_TOKEN_FORGOT_PASSWORD_EXPIRES_IN;
          break;
        default:
          throw new ApiError(
            statusCode.UNAUTHORIZED,
            errorMessages.INVALID_TOKEN_TYPE,
          );
      }

      return jsonwebtoken.sign(payload, secret, { expiresIn });
    } catch (e) {
      throw new ApiError(statusCode.UNAUTHORIZED, errorMessages.INVALID_TOKEN);
    }
  }
  public verifyActionToken(token: string, type: EActionTokenType): IJwtPayload {
    try {
      let secret: string;

      switch (type) {
        case EActionTokenType.SETUP_MANAGER:
          secret = config.ACTION_TOKEN_SETUP_MANAGER_SECRET;
          break;
        case EActionTokenType.FORGOT_PASSWORD:
          secret = config.ACTION_TOKEN_FORGOT_PASSWORD_SECRET;
          break;
        default:
          throw new ApiError(
            statusCode.UNAUTHORIZED,
            errorMessages.WRONG_TOKEN_TYPE,
          );
      }
      return jsonwebtoken.verify(token, secret) as IJwtPayload;
    } catch (e) {
      throw new ApiError(statusCode.UNAUTHORIZED, errorMessages.INVALID_TOKEN);
    }
  }
}

export const tokenService = new TokenService();

import { NextFunction, Request, Response } from "express";

import { errorMessages } from "../constants/error-messages.constant";
import { statusCode } from "../constants/status-codes.constant";
import { ERole } from "../enums/role.enum";
import { ETokenType } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { ITokenDB } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { tokenService } from "../services/token.service";

class AuthMiddleware {
  public async isEmailExist(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body as Partial<IUser>;
      const user = await userRepository.findByParams({ email });

      if (user) {
        throw new ApiError(
          statusCode.CONFLICT,
          errorMessages.EMAIL_ALREADY_EXISTS,
        );
      }
      next();
    } catch (e) {
      next(e);
    }
  }
  public verifyToken(type: ETokenType) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = req.headers.authorization;
        if (!token) {
          throw new ApiError(
            statusCode.UNAUTHORIZED,
            errorMessages.NO_TOKEN_PROVIDED,
          );
        }
        const payload = tokenService.verifyToken(token, type);
        let tokenPair: ITokenDB;
        if (type === ETokenType.ACCESS) {
          tokenPair = await tokenRepository.findByParams({
            accessToken: token,
          });
        } else if (type === ETokenType.REFRESH) {
          tokenPair = await tokenRepository.findByParams({
            refreshToken: token,
          });
        }

        if (!tokenPair) {
          throw new ApiError(
            statusCode.UNAUTHORIZED,
            errorMessages.INVALID_TOKEN,
          );
        }
        req.res.locals.jwtPayload = payload;
        req.res.locals.tokenPair = tokenPair;
        next();
      } catch (e) {
        next(e);
      }
    };
  }
  public async isAdminOrManager(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJwtPayload;
      if (
        jwtPayload.role !== ERole.MANAGER &&
        jwtPayload.role !== ERole.ADMINISTRATOR
      ) {
        throw new ApiError(
          statusCode.UNAUTHORIZED,
          errorMessages.NOT_ALLOWED_CREATE_BRAND,
        );
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();

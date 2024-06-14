import { NextFunction, Request, Response } from "express";

import { errorMessages } from "../constants/error-messages.constant";
import { statusCode } from "../constants/status-codes.constant";
import { EAccountType } from "../enums/account-type.enum";
import { EActionTokenType } from "../enums/action-token-type.enum";
import { ERole } from "../enums/role.enum";
import { ETokenType } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { ITokenDB } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { tokenService } from "../services/token.service";

class AuthMiddleware {
  public async isEmailExist(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body as Partial<IUser>;
      const user = await userRepository.findByParams({
        email: email.toLowerCase(),
      });

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
          errorMessages.ACCESS_DENIED_USER_ROLE,
        );
      }
      next();
    } catch (e) {
      next(e);
    }
  }
  public async isAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJwtPayload;
      if (jwtPayload.role !== ERole.ADMINISTRATOR) {
        throw new ApiError(
          statusCode.UNAUTHORIZED,
          errorMessages.ACCESS_DENIED_USER_ROLE,
        );
      }
      next();
    } catch (e) {
      next(e);
    }
  }
  public verifyActionToken(type: EActionTokenType) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = req.query.actionToken as string;
        if (!token) {
          throw new ApiError(
            statusCode.UNAUTHORIZED,
            errorMessages.NO_TOKEN_PROVIDED,
          );
        }

        const presentToken = await actionTokenRepository.findByParams({
          token,
        });

        if (!presentToken) {
          throw new ApiError(
            statusCode.UNAUTHORIZED,
            errorMessages.INVALID_TOKEN,
          );
        }
        const payload = tokenService.verifyActionToken(token, type);
        req.res.locals.jwtPayload = payload;
        req.res.locals.actionTokenDb = presentToken;
        next();
      } catch (e) {
        next(e);
      }
    };
  }
  public async isPremiumAccount(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { accountType } = req.res.locals.jwtPayload as IJwtPayload;

      if (accountType !== EAccountType.PREMIUM) {
        throw new ApiError(
          statusCode.FORBIDDEN,
          errorMessages.ACCESS_DENIED_FOR_BASIC_ACCOUNT,
        );
      }

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();

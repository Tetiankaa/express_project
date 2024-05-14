import { NextFunction, Request, Response } from "express";

import { errorMessages } from "../constants/error-messages.constant";
import { statusCode } from "../constants/status-codes.constant";
import { ETokenType } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
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
  public async verifyToken(type: ETokenType) {
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

        const tokenPair = await tokenRepository.findByParams({});
        req.res.locals.jwtPayload = payload;
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const authMiddleware = new AuthMiddleware();

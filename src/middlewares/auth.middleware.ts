import { NextFunction, Request, Response } from "express";

import { errorMessages } from "../constants/error-messages.constant";
import { statusCode } from "../constants/status-codes.constant";
import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

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
}

export const authMiddleware = new AuthMiddleware();

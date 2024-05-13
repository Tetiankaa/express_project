import { NextFunction, Request, Response } from "express";

import { statusCode } from "../constants/status-codes.constant";
import { IUser } from "../interfaces/user.interface";
import { AuthMapper } from "../mappers/auth.mapper";
import { authService } from "../services/auth.service";

class AuthController {
  public async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as Partial<IUser>;
      const { user, tokens } = await authService.signUp(body);
      const responseDto = AuthMapper.toAuthResponseDto({ user, tokens });
      res.status(statusCode.CREATED).json(responseDto);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();

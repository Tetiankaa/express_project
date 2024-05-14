import { NextFunction, Request, Response } from "express";

import { statusCode } from "../constants/status-codes.constant";
import { IAuthCredentials } from "../interfaces/auth.interface";
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
  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const credentials = req.body as IAuthCredentials;
      const { user, tokens } = await authService.signIn(credentials);
      const responseDto = AuthMapper.toAuthResponseDto({ user, tokens });
      res.status(statusCode.CREATED).json(responseDto);
    } catch (e) {
      next(e);
    }
  }
  public async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.body as string;
     const response = await authService.refresh(token);
      res.status(statusCode.NO_CONTENT).json(response);
    }catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();

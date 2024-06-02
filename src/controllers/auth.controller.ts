import { NextFunction, Request, Response } from "express";

import { statusCode } from "../constants/status-codes.constant";
import { IActionToken } from "../interfaces/action-token.interface";
import {
  IAuthCredentials,
  IChangePassword,
  IForgotPassword,
  ISetPassword,
} from "../interfaces/auth.interface";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { ITokenDB } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { AuthMapper } from "../mappers/auth.mapper";
import { UserMapper } from "../mappers/user.mapper";
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
      const { _userId } = req.res.locals.jwtPayload as IJwtPayload;
      const { _id } = req.res.locals.tokenPair as ITokenDB;

      const response = await authService.refresh(_userId, _id);
      res.status(statusCode.CREATED).json(response);
    } catch (e) {
      next(e);
    }
  }
  public async createManagerAccount(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const body = req.body as Partial<IUser>;
      const managerInfo = await authService.createManagerAccount(body);
      res.status(statusCode.CREATED).json(UserMapper.toPrivateDto(managerInfo));
    } catch (e) {
      next(e);
    }
  }
  public async setManagerPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { password } = req.body as ISetPassword;
      const { _userId } = req.res.locals.jwtPayload as IJwtPayload;
      const { _id } = req.res.locals.actionTokenDb as IActionToken;
      await authService.setManagerPassword(password, _userId, _id);
      res.sendStatus(statusCode.CREATED);
    } catch (e) {
      next(e);
    }
  }
  public async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as IChangePassword;
      const { _userId } = req.res.locals.jwtPayload as IJwtPayload;
      await authService.changePassword(body, _userId);
      res.sendStatus(statusCode.CREATED);
    } catch (e) {
      next(e);
    }
  }
  public async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as IForgotPassword;
      await authService.forgotPassword(body);
      res.sendStatus(statusCode.CREATED);
    } catch (e) {
      next(e);
    }
  }
  public async setForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const body = req.body as ISetPassword;
      const { _userId } = req.res.locals.jwtPayload as IJwtPayload;
      const { _id } = req.res.locals.actionTokenDb as IActionToken;
      await authService.setForgotPassword(body, _userId, _id);
      res.sendStatus(statusCode.CREATED);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();

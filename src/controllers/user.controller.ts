import { NextFunction, Request, Response } from "express";

import { statusCode } from "../constants/status-codes.constant";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { IUser } from "../interfaces/user.interface";
import { UserMapper } from "../mappers/user.mapper";
import { userService } from "../services/user.service";

class UserController {
  public async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getUsers();
      const response = UserMapper.toListDto(users);
      res.json(response);
    } catch (e) {
      next(e);
    }
  }
  public async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const user = await userService.getUser(userId);
      const response = UserMapper.toDto(user);
      res.json(response);
    } catch (e) {
      next(e);
    }
  }
  public async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const { _userId } = req.res.locals.jwtPayload as IJwtPayload;
      const user = await userService.getMe(_userId);
      const response = UserMapper.toDto(user);
      res.json(response);
    } catch (e) {
      next(e);
    }
  }

  public async deleteMe(req: Request, res: Response, next: NextFunction) {
    try {
      const { _userId } = req.res.locals.jwtPayload as IJwtPayload;
      await userService.deleteMe(_userId);
      res.sendStatus(statusCode.NO_CONTENT);
    } catch (e) {
      next(e);
    }
  }
  public async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const { _userId } = req.res.locals.jwtPayload as IJwtPayload;
      const data = req.body as Partial<IUser>;
      const user = await userService.updateMe(_userId, data);
      const response = UserMapper.toDto(user);
      res.status(statusCode.CREATED).json(response);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();

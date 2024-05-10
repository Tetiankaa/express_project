import {NextFunction, Request, Response} from "express";
import {IUser} from "../interfaces/user.interface";
import {authService} from "../services/auth.service";
import {statusCode} from "../constants/status-codes.constants";
import {UserMapper} from "../mappers/user.mapper";

class AuthController {
    public async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body as Partial<IUser>;
            const user = await authService.signUp(body)
            const response = UserMapper.toDto(user);
            res.status(statusCode.CREATED).json(response);
        }catch (e){
            next(e);
        }
    }
}

export const authController = new AuthController();

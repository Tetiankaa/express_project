import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

import { statusCode } from "../constants/status-codes.constant";
import { ApiError } from "../errors/api-error";

class CommonMiddleware {
  public isBodyValid(validator: ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { error } = await validator.validateAsync(req.body);

        if (error) {
          throw new ApiError(statusCode.BAD_REQUEST, error.details[0].message);
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const commonMiddleware = new CommonMiddleware();

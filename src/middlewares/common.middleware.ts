import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isObjectIdOrHexString } from "mongoose";

import { errorMessages } from "../constants/error-messages.constant";
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
  public isIdValid(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      if (!isObjectIdOrHexString(userId)) {
        throw new ApiError(statusCode.NOT_FOUND, errorMessages.INVALID_ID);
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const commonMiddleware = new CommonMiddleware();

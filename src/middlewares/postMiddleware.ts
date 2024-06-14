import { NextFunction, Request, Response } from "express";

import { config } from "../configs/config";
import { errorMessages } from "../constants/error-messages.constant";
import { statusCode } from "../constants/status-codes.constant";
import { EAccountType } from "../enums/account-type.enum";
import { EPostStatus } from "../enums/post-status.enum";
import { ApiError } from "../errors/api-error";
import { ICar } from "../interfaces/car.interface";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { IPostBasic } from "../interfaces/post.interface";
import { IPrice } from "../interfaces/price.interface";
import { postRepository } from "../repositories/post.repository";
import { currencyService } from "../services/currency.service";

class PostMiddleware {
  public async isPostExistsAnsBelongsToUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const postId = req.params.id;
      const { _userId } = req.res.locals.jwtPayload as IJwtPayload;
      const post = await postRepository.findOneByParams({
        _id: postId,
        user_id: _userId,
      });
      if (!post) {
        throw new ApiError(statusCode.NOT_FOUND, errorMessages.POST_NOT_FOUND);
      }
      req.res.locals.post = post as IPostBasic;
      next();
    } catch (e) {
      next(e);
    }
  }
  public async isPostNotDeletedAndActive(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const postId = req.params.id;
      const { _userId } = req.res.locals.jwtPayload as IJwtPayload;
      const post = await postRepository.findOneByParams({
        _id: postId,
        user_id: _userId,
        isDeleted: false,
        status: EPostStatus.ACTIVE,
      });
      if (!post) {
        throw new ApiError(statusCode.NOT_FOUND, errorMessages.POST_NOT_FOUND);
      }
      req.res.locals.postToUpdate = post as IPostBasic;
      next();
    } catch (e) {
      next(e);
    }
  }
  public async isPostDeletedAndNotActive(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const postId = req.params.id;
      const { _userId } = req.res.locals.jwtPayload as IJwtPayload;
      const post = await postRepository.findOneByParams({
        _id: postId,
        user_id: _userId,
        isDeleted: true,
        status: EPostStatus.NOT_ACTIVE,
      });
      if (!post) {
        throw new ApiError(statusCode.NOT_FOUND, errorMessages.POST_NOT_FOUND);
      }
      req.res.locals.deletedPost = post as IPostBasic;
      next();
    } catch (e) {
      next(e);
    }
  }
  public async isResubmissionAllowed(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const postId = req.params.id;
      const { _userId } = req.res.locals.jwtPayload as IJwtPayload;
      const post = await postRepository.findOneByParams({
        _id: postId,
        user_id: _userId,
        isDeleted: false,
        status: EPostStatus.NOT_ACTIVE,
      });
      if (!post) {
        throw new ApiError(statusCode.NOT_FOUND, errorMessages.POST_NOT_FOUND);
      }
      if (post.profanityEdits >= config.MAX_PROFANITY_EDITS) {
        throw new ApiError(
          statusCode.FORBIDDEN,
          errorMessages.ACHIEVED_MAX_NUMBER_OF_PROFANITY_EDITS,
        );
      }
      req.res.locals.oldPost = post as IPostBasic;
      next();
    } catch (e) {
      next(e);
    }
  }
  public async calculatePrices(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { enteredPrice, enteredCurrency } = req.body as Partial<ICar>;

      if (enteredPrice && enteredCurrency) {
        const {
          rates: { usd, eur },
        } = await currencyService.getExchangeRates();
        const calculated = await currencyService.calculatePrices(
          enteredPrice,
          enteredCurrency,
          usd,
          eur,
        );

        req.res.locals.prices = calculated as IPrice[];
      }
      next();
    } catch (e) {
      next(e);
    }
  }
  public async checkBasicAccountPostLimit(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJwtPayload;

      const postsCount = await postRepository.countDocumentsByParams({
        user_id: jwtPayload._userId,
      });

      if (jwtPayload.accountType === EAccountType.BASIC && postsCount >= 1) {
        throw new ApiError(
          statusCode.FORBIDDEN,
          errorMessages.ONE_POST_FOR_BASIC_ACCOUNT,
        );
      }
      req.res.locals.postsCount = postsCount as number;
      next();
    } catch (e) {
      next(e);
    }
  }

  public async isPostExists(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = req.params.id;
      const post = await postRepository.findOneByParams({ _id: postId });

      if (!post) {
        throw new ApiError(statusCode.NOT_FOUND, errorMessages.POST_NOT_FOUND);
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const postMiddleware = new PostMiddleware();

import { NextFunction, Request, Response } from "express";

import { errorMessages } from "../constants/error-messages.constant";
import { statusCode } from "../constants/status-codes.constant";
import { EPostStatus } from "../enums/post-status.enum";
import { ApiError } from "../errors/api-error";
import { IPostBasic } from "../interfaces/post.interface";
import { postRepository } from "../repositories/post.repository";

class PostMiddleware {
  public async isPostNotDeletedAndActive(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const postId = req.params.id;

      const post = await postRepository.getById(postId);
      if (!post) {
        throw new ApiError(statusCode.NOT_FOUND, errorMessages.POST_NOT_FOUND);
      }
      if (post.isDeleted || post.status === EPostStatus.NOT_ACTIVE) {
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

      const post = await postRepository.getById(postId);
      if (!post) {
        throw new ApiError(statusCode.NOT_FOUND, errorMessages.POST_NOT_FOUND);
      }
      if (!post.isDeleted || post.status === EPostStatus.ACTIVE) {
        throw new ApiError(statusCode.NOT_FOUND, errorMessages.POST_NOT_FOUND);
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const postMiddleware = new PostMiddleware();

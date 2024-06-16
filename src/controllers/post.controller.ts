import { NextFunction, Request, Response } from "express";

import { statusCode } from "../constants/status-codes.constant";
import { ICar, ICarDto } from "../interfaces/car.interface";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { IPostBasic, IPostWithCarAndUser } from "../interfaces/post.interface";
import { IPrice } from "../interfaces/price.interface";
import { IQuery } from "../interfaces/query.interface";
import { ITokenDB, ITokenResponse } from "../interfaces/token.interface";
import { IUserDTO } from "../interfaces/user.interface";
import { PostMapper } from "../mappers/post.mapper";
import { postService } from "../services/post.service";

class PostController {
  public async saveCar(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJwtPayload;
      const { _id } = req.res.locals.tokenPair as ITokenDB;
      const carToSave = req.body as Partial<ICar>;
      const prices = req.res.locals.prices as IPrice[];
      const postsCount = req.res.locals.postsCount as number;
      const savedPost = await postService.saveCar(
        carToSave,
        jwtPayload,
        _id,
        prices,
        postsCount,
      );
      const response: {
        data: IPostWithCarAndUser<ICarDto, IUserDTO>;
        tokens?: ITokenResponse;
      } = {
        data: PostMapper.toPrivatePost(savedPost.data),
        tokens: savedPost.tokens,
      };
      res.status(statusCode.CREATED).json(response);
      next();
    } catch (e) {
      next(e);
    }
  }
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as IQuery;
      const posts = await postService.getAll(query);
      const response = PostMapper.toPublicResponseList(posts);
      res.json(response);
    } catch (e) {
      next(e);
    }
  }

  public async getMyPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const { _userId } = req.res.locals.jwtPayload as IJwtPayload;
      const query = req.query as IQuery;
      const posts = await postService.getMyPosts(_userId, query);
      const response = PostMapper.toPrivateResponseList(posts);
      res.json(response);
    } catch (e) {
      next(e);
    }
  }

  public async getPublicPostById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = req.params.id;
      const post = await postService.getPublicPostById(id);
      const response = PostMapper.toPublicPost(post);
      res.json(response);
    } catch (e) {
      next(e);
    }
  }

  public async getPrivatePostById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const post = req.res.locals.post as IPostBasic;
      const postInfo = await postService.getPrivatePostById(post);
      const response = PostMapper.toPrivatePost(postInfo);
      res.json(response);
    } catch (e) {
      next(e);
    }
  }

  public async deletePostById(req: Request, res: Response, next: NextFunction) {
    try {
      const post = req.res.locals.post as IPostBasic;
      await postService.deletePostById(post);
      res.sendStatus(statusCode.NO_CONTENT);
    } catch (e) {
      next(e);
    }
  }
  public async deleteForeverPostById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { _id } = req.res.locals.post as IPostBasic;
      await postService.deleteForeverPostById(_id);
      res.sendStatus(statusCode.NO_CONTENT);
    } catch (e) {
      next(e);
    }
  }
  public async getMyArchivePosts(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { _userId } = req.res.locals.jwtPayload as IJwtPayload;
      const query = req.query as IQuery;
      const posts = await postService.getMyArchivePosts(_userId, query);
      const response = PostMapper.toPrivateResponseList(posts);
      res.json(response);
    } catch (e) {
      next(e);
    }
  }

  public async updatePost(req: Request, res: Response, next: NextFunction) {
    try {
      const postToUpdate = req.res.locals.postToUpdate as IPostBasic;
      const carBody = req.body as Partial<ICar>;
      const { _userId } = req.res.locals.jwtPayload as IJwtPayload;
      const prices = req.res.locals.prices as IPrice[];
      const post = await postService.updatePost(
        postToUpdate,
        carBody,
        _userId,
        prices,
      );
      const response = PostMapper.toPrivatePost(post);
      res.status(statusCode.CREATED).json(response);
    } catch (e) {
      next(e);
    }
  }

  public async restorePost(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedPost = req.res.locals.deletedPost as IPostBasic;
      const post = await postService.restorePost(deletedPost);
      const response = PostMapper.toPrivatePost(post);
      res.status(statusCode.CREATED).json(response);
    } catch (e) {
      next(e);
    }
  }

  public async updatePostAfterProfanity(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const oldPost = req.res.locals.oldPost as IPostBasic;
      const body = req.body as Partial<ICar>;
      const post = await postService.updatePostAfterProfanity(oldPost, body);
      const newPost = PostMapper.toPrivatePost(post);
      res.status(statusCode.CREATED).json(newPost);
    } catch (e) {
      next(e);
    }
  }
  public async getPostsWithProfanity(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = req.query as IQuery;
      const posts = await postService.getPostsWithProfanity(query);
      const response = PostMapper.toPrivateResponseList(posts);
      res.json(response);
    } catch (e) {
      next(e);
    }
  }
  public async getPostWithProfanityById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const postId = req.params.id;
      const post = await postService.getPostWithProfanityById(postId);
      const response = PostMapper.toPrivatePost(post);
      res.json(response);
    } catch (e) {
      next(e);
    }
  }
  public async saveView(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = req.params.id;
      await postService.saveView(postId);
      res.sendStatus(statusCode.NO_CONTENT);
    } catch (e) {
      next(e);
    }
  }
  public async getPostInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const post = req.res.locals.post as IPostBasic;
       await postService.getPostInfo(post);
      // const response = PostMappe
      res.json("ok");
    }catch (e) {
      next(e);
    }
  }
}
export const postController = new PostController();

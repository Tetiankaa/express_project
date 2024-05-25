import { NextFunction, Request, Response } from "express";

import { statusCode } from "../constants/status-codes.constant";
import { ICar } from "../interfaces/car.interface";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { IPostBasic } from "../interfaces/post.interface";
import { IQuery } from "../interfaces/query.interface";
import { PostMapper } from "../mappers/post.mapper";
import { postService } from "../services/post.service";

class PostController {
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
      const id = req.params.id;
      const { _userId } = req.res.locals.jwtPayload as IJwtPayload;
      const post = await postService.getPrivatePostById(id, _userId);
      const response = PostMapper.toPrivatePost(post);
      res.json(response);
    } catch (e) {
      next(e);
    }
  }
  public async deletePostById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const { _userId } = req.res.locals.jwtPayload as IJwtPayload;
      await postService.deletePostById(id, _userId);
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
      const post = await postService.updatePost(postToUpdate, carBody);
      const response = PostMapper.toPrivatePost(post);
      res.status(statusCode.CREATED).json(response);
    } catch (e) {
      next(e);
    }
  }
  public async restorePost(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = req.params.id;
      const post = await postService.restorePost(postId);
      const response = PostMapper.toPrivatePost(post);
      res.status(statusCode.CREATED).json(response);
    } catch (e) {
      next(e);
    }
  }
}

export const postController = new PostController();

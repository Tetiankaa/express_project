import { NextFunction, Request, Response } from "express";

import { IQuery } from "../interfaces/query.interface";
import { PostMapper } from "../mappers/post.mapper";
import { postService } from "../services/post.service";

class PostController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as IQuery;
      const posts = await postService.getAll(query);
      const response = PostMapper.toPostsWithCarResponse(posts);
      res.json(response);
    } catch (e) {
      next(e);
    }
  }
  public async getMyPosts(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (e) {
      next(e);
    }
  }
}

export const postController = new PostController();

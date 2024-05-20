import { FilterQuery } from "mongoose";

import { IPostDetails, IPostResponse } from "../interfaces/post.interface";
import { IQuery } from "../interfaces/query.interface";
import { Post } from "../models/post.module";

class PostRepository {
  public async getAll(query: IQuery): Promise<IPostResponse<IPostDetails>> {
    const { page = 1, limit = 20 } = query;
    const skip: number = (page - 1) * limit;

    const posts = await Post.find().skip(skip).limit(limit);
    const totalPosts = await Post.countDocuments();
    return {
      data: posts,
      page,
      limit,
      total: totalPosts,
    };
  }
  public async getById(postId: string): Promise<IPostDetails> {
    return await Post.findOne({ _id: postId });
  }
  public async deleteById(postId: string): Promise<void> {
    await Post.findOneAndDelete({ _id: postId });
  }
  public async findByParams(
    params: FilterQuery<IPostDetails>,
  ): Promise<IPostDetails[]> {
    return await Post.find(params);
  }
  public async create(post: Partial<IPostDetails>): Promise<IPostDetails> {
    return await Post.create(post);
  }
  public async countDocumentsByParams(
    params: FilterQuery<IPostDetails>,
  ): Promise<number> {
    return await Post.countDocuments(params);
  }
}

export const postRepository = new PostRepository();

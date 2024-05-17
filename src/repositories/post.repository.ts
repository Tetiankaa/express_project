import { FilterQuery } from "mongoose";

import { IPost } from "../interfaces/post.interface";
import { Post } from "../models/post.module";

class PostRepository {
  public async getAll(): Promise<IPost[]> {
    return await Post.find();
  }
  public async getById(postId: string): Promise<IPost> {
    return await Post.findOne({ _id: postId });
  }
  public async deleteById(postId: string): Promise<void> {
    await Post.findOneAndDelete({ _id: postId });
  }
  public async findByParams(params: FilterQuery<IPost>): Promise<IPost[]> {
    return await Post.find(params);
  }
  public async create(post: Partial<IPost>): Promise<IPost> {
    return await Post.create(post);
  }
  public async countDocumentsByParams(
    params: FilterQuery<IPost>,
  ): Promise<number> {
    return await Post.countDocuments(params);
  }
}

export const postRepository = new PostRepository();

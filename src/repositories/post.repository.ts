import { FilterQuery } from "mongoose";

import { IPost } from "../interfaces/post.interface";
import { Post } from "../models/post.module";
import {IUser} from "../interfaces/user.interface";

class PostRepository {
  public async getAll(): Promise<IPost[]> {
    return Post.find();
  }
  public async getById(postId: string): Promise<IPost> {
    return Post.findOne({ _id: postId });
  }
  public async deleteById(postId: string): Promise<void> {
    await Post.findOneAndDelete({ _id: postId });
  }
  public async findByParams(params: FilterQuery<IPost>): Promise<IPost[]> {
    return Post.find(params);
  }
  public async create(post: Partial<IPost>): Promise<IPost> {
    return await Post.create(post);
  }
  public async countDocumentsByParams(params: FilterQuery<IUser>): Promise<number> {
    return Post.countDocuments(params);
  }
}

export const postRepository = new PostRepository();

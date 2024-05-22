import { FilterQuery } from "mongoose";

import {IPostBasic, IPostResponse} from "../interfaces/post.interface";
import { IQuery } from "../interfaces/query.interface";
import { Post } from "../models/post.module";

class PostRepository {
  public async getAll(query: IQuery, filter?:FilterQuery<IPostBasic>): Promise<IPostResponse<IPostBasic>> {
    const { page = 1, limit = 20 } = query;
    const skip: number = (+page - 1) * +limit;
    const filterObj:FilterQuery<IPostBasic> = {isDeleted: false};
    if (filter) {
      filterObj.user_id = filter.user_id;
    }
    const posts = await Post.find(filterObj).skip(skip).limit(+limit);
    const totalFilteredPosts = posts.length;
    const totalAllPosts = await Post.countDocuments(filterObj);
    return {
      data: posts,
      page: +page,
      limit: +limit,
      total: filter ? totalFilteredPosts : totalAllPosts,
    };
  }
  public async getById(postId: string): Promise<IPostBasic> {
    return await Post.findOne({ _id: postId });
  }
  public async deleteById(postId: string): Promise<void> {
    await Post.findOneAndUpdate({ _id: postId },{isDeleted: true});
  }
  public async findOneByParams(
      params: FilterQuery<IPostBasic>,
  ): Promise<IPostBasic> {
    return await Post.findOne(params);
  }
  public async findByParams(
    params: FilterQuery<IPostBasic>,
  ): Promise<IPostBasic[]> {
    return await Post.find(params);
  }
  public async create(post: Partial<IPostBasic>): Promise<IPostBasic> {
    return await Post.create(post);
  }
  public async deleteManyByParams(filter: FilterQuery<IPostBasic>): Promise<void> {
    console.log(filter)
    await Post.deleteMany(filter);
  }
  public async countDocumentsByParams(
    params: FilterQuery<IPostBasic>,
  ): Promise<number> {
    return await Post.countDocuments(params);
  }
}

export const postRepository = new PostRepository();

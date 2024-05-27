import { FilterQuery, UpdateQuery } from "mongoose";

import { EPostStatus } from "../enums/post-status.enum";
import { IPostBasic } from "../interfaces/post.interface";
import { IQuery } from "../interfaces/query.interface";
import { Post } from "../models/post.module";
import {IListResponse} from "../interfaces/list-response.interface";

class PostRepository {
  public async getAll(
    query: IQuery,
    filter?: FilterQuery<IPostBasic>,
    applyDefaultFilter: boolean = true,
  ): Promise<IListResponse<IPostBasic>> {
    const { page = 1, limit = 20 } = query;
    const skip: number = (+page - 1) * +limit;
    const filterObj: FilterQuery<IPostBasic> = {};

    if (applyDefaultFilter) {
      Object.assign(filterObj, {
        isDeleted: false,
        status: EPostStatus.ACTIVE,
      });
    }
    if (filter) {
      Object.assign(filterObj, filter);
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
  public async deleteById(
    postId: string,
    updateQuery?: UpdateQuery<IPostBasic>,
  ): Promise<void> {
    await Post.findOneAndUpdate({ _id: postId }, updateQuery);
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
  public async deleteManyByParams(
    filter: FilterQuery<IPostBasic>,
  ): Promise<void> {
    await Post.deleteMany(filter);
  }
  public async countDocumentsByParams(
    params: FilterQuery<IPostBasic>,
  ): Promise<number> {
    return await Post.countDocuments(params);
  }
  public async updateById(
    postId: string,
    post: Partial<IPostBasic>,
  ): Promise<IPostBasic> {
    return await Post.findOneAndUpdate({ _id: postId }, post, {
      returnDocument: "after",
    });
  }
}

export const postRepository = new PostRepository();

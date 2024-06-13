import { FilterQuery, SortOrder, UpdateQuery } from "mongoose";

import { errorMessages } from "../constants/error-messages.constant";
import { statusCode } from "../constants/status-codes.constant";
import { EOrder } from "../enums/order.enum";
import { EPostOrderBy } from "../enums/post-order.enum";
import { EPostStatus } from "../enums/post-status.enum";
import { ApiError } from "../errors/api-error";
import { IListResponse } from "../interfaces/list-response.interface";
import { IPostBasic } from "../interfaces/post.interface";
import { IQuery } from "../interfaces/query.interface";
import { Post } from "../models/post.module";

class PostRepository {
  public async getAll(
    query: IQuery,
    filter?: FilterQuery<IPostBasic>,
    applyDefaultFilter: boolean = true,
  ): Promise<IListResponse<IPostBasic>> {
    const {
      page = 1,
      limit = 20,
      order = EOrder.DESC,
      orderBy = EPostOrderBy.UPDATED_AT,
      isDeleted,
      profanityEdits,
    } = query;
    const skip: number = (+page - 1) * +limit;
    const filterObj: FilterQuery<IPostBasic> = {};
    const sortObj: { [key: string]: SortOrder } = {};

    if (orderBy) {
      switch (orderBy) {
        case EPostOrderBy.UPDATED_AT:
          sortObj.updatedAt = order;
          break;
        default:
          throw new ApiError(
            statusCode.BAD_REQUEST,
            errorMessages.INVALID_ORDER_BY,
          );
      }
    }
    if (applyDefaultFilter) {
      Object.assign(filterObj, {
        isDeleted: false,
        status: EPostStatus.ACTIVE,
      });
    }
    if (typeof isDeleted !== "undefined") {
      filterObj.isDeleted = isDeleted;
    }
    if (filter) {
      Object.assign(filterObj, filter);
    }
    if (profanityEdits) {
      filterObj.profanityEdits = profanityEdits;
    }
    const posts = await Post.find(filterObj)
      .skip(skip)
      .limit(+limit)
      .sort(sortObj);
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
  public async findOneAndUpdate(
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
  public async deleteById(postId: string): Promise<void> {
    await Post.findByIdAndDelete(postId);
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

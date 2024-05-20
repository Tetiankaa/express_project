import { IPostResponse, IPostWithCar } from "../interfaces/post.interface";
import { IQuery } from "../interfaces/query.interface";
import { carRepository } from "../repositories/car.repository";
import { postRepository } from "../repositories/post.repository";

class PostService {
  public async getAll(query: IQuery): Promise<IPostResponse<IPostWithCar>> {
    const posts = await postRepository.getAll({
      limit: +query.limit,
      page: +query.page,
    });
    const publicPosts = await Promise.all(
      posts.data.map(async (post) => {
        const car = await carRepository.getById(post.car_id);
        return {
          _id: post._id,
          createdAt: post.createdAt,
          car,
        };
      }),
    );

    return {
      page: posts.page,
      limit: posts.limit,
      total: posts.total,
      data: publicPosts,
    };
  }
}

export const postService = new PostService();

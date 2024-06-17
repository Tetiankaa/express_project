import { config } from "../configs/config";
import { errorMessages } from "../constants/error-messages.constant";
import { statusCode } from "../constants/status-codes.constant";
import { EEmailType } from "../enums/email-type.enum";
import { EPostStatus } from "../enums/post-status.enum";
import { ERole } from "../enums/role.enum";
import { ETimeLabel } from "../enums/time-label.enum";
import { ApiError } from "../errors/api-error";
import { TimeHelper } from "../helpers/time.helper";
import { ICar } from "../interfaces/car.interface";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { IListResponse } from "../interfaces/list-response.interface";
import { IPostBasic, IPostWithCarAndUser } from "../interfaces/post.interface";
import { IPostInfo } from "../interfaces/post-info.interface";
import { IPrice } from "../interfaces/price.interface";
import { IQuery } from "../interfaces/query.interface";
import { ITimePeriod } from "../interfaces/time-periods.interface";
import { ITokenResponse } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { carRepository } from "../repositories/car.repository";
import { postRepository } from "../repositories/post.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { viewRepository } from "../repositories/view.repository";
import { authService } from "./auth.service";
import { currencyService } from "./currency.service";
import { emailService } from "./email.service";
import { profanityService } from "./profanity.service";

class PostService {
  public async saveCar(
    car: Partial<ICar>,
    jwtPayload: IJwtPayload,
    oldTokenId: string,
    prices: IPrice[],
    postsCount: number,
  ): Promise<{
    data: IPostWithCarAndUser<ICar, IUser>;
    tokens?: ITokenResponse;
  }> {
    const isProfanityPresent = profanityService.checkForProfanity(car);

    const savedCar = await carRepository.create({ ...car, prices });
    const post = await postRepository.create({
      user_id: jwtPayload._userId,
      car_id: savedCar._id,
      profanityEdits: 0,
      status: isProfanityPresent ? EPostStatus.NOT_ACTIVE : EPostStatus.ACTIVE,
    });
    const user = await userRepository.getById(jwtPayload._userId);

    let tokens: ITokenResponse;
    if (postsCount === 0 && jwtPayload.role === ERole.BUYER) {
      const user = await userRepository.updateById(jwtPayload._userId, {
        role: ERole.SELLER,
      });
      await tokenRepository.deleteById(oldTokenId);
      tokens = await authService.generateTokens(user);
    }
    if (isProfanityPresent) {
      await emailService.sendByEmailType(
        EEmailType.POST_PROFANITY_DETECTED_FOR_USER,
        {
          firstName: user.firstName,
          numberOfAttempts: config.MAX_PROFANITY_EDITS,
        },
        user.email,
      );
    }

    return {
      data: {
        car: savedCar,
        user,
        status: post.status,
        profanityEdits: post.profanityEdits,
        isDeleted: post.isDeleted,
        _id: post._id,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      },
      tokens,
    };
  }
  public async getAll(
    query: IQuery,
  ): Promise<IListResponse<IPostWithCarAndUser<ICar, IUser>>> {
    const posts = await postRepository.getAll(query);
    const publicPosts = await Promise.all(
      posts.data.map(async (post) => await this.fetchCarAndUserForPost(post)),
    );

    return {
      page: posts.page,
      limit: posts.limit,
      total: posts.total,
      data: publicPosts,
    };
  }
  public async getMyPosts(
    userId: string,
    query: IQuery,
  ): Promise<IListResponse<IPostWithCarAndUser<ICar, IUser>>> {
    const posts = await postRepository.getAll(query, { user_id: userId });
    const myPosts = await Promise.all(
      posts.data.map(async (post) => await this.fetchCarAndUserForPost(post)),
    );
    return {
      page: posts.page,
      limit: posts.limit,
      total: posts.total,
      data: myPosts,
    };
  }
  public async getPublicPostById(
    postId: string,
  ): Promise<IPostWithCarAndUser<ICar, IUser>> {
    const post = await postRepository.findOneByParams({
      _id: postId,
      isDeleted: false,
    });
    if (!post) {
      throw new ApiError(statusCode.NOT_FOUND, errorMessages.POST_NOT_FOUND);
    }
    return await this.fetchCarAndUserForPost(post);
  }
  public async getPrivatePostById(
    post: IPostBasic,
  ): Promise<IPostWithCarAndUser<ICar, IUser>> {
    return await this.fetchCarAndUserForPost(post);
  }
  public async deletePostById(post: IPostBasic): Promise<void> {
    if (!post.isDeleted) {
      await postRepository.findOneAndUpdate(post._id, {
        isDeleted: true,
        status: EPostStatus.NOT_ACTIVE,
      });
    }
  }
  public async deleteForeverPostById(postId: string): Promise<void> {
    await postRepository.deleteById(postId);
  }
  public async getMyArchivePosts(
    userId: string,
    query: IQuery,
  ): Promise<IListResponse<IPostWithCarAndUser<ICar, IUser>>> {
    const posts = await postRepository.getAll(
      query,
      {
        user_id: userId,
        status: EPostStatus.NOT_ACTIVE,
      },
      false,
    );
    const myPosts = await Promise.all(
      posts.data.map(async (post) => await this.fetchCarAndUserForPost(post)),
    );
    return {
      page: posts.page,
      limit: posts.limit,
      total: posts.total,
      data: myPosts,
    };
  }
  public async updatePost(
    post: IPostBasic,
    car: Partial<ICar>,
    user_id: string,
    prices: IPrice[],
  ): Promise<IPostWithCarAndUser<ICar, IUser>> {
    const user = await userRepository.getById(user_id);
    const isProfanityPresent = profanityService.checkForProfanity(car);
    if (isProfanityPresent) {
      await emailService.sendByEmailType(
        EEmailType.POST_PROFANITY_DETECTED_FOR_USER,
        {
          firstName: user.firstName,
          numberOfAttempts: config.MAX_PROFANITY_EDITS,
        },
        user.email,
      );
    }
    await carRepository.updateById(post.car_id, { ...car, prices });
    return await this.fetchCarAndUserForPost(post);
  }
  public async restorePost(
    deletedPost: IPostBasic,
  ): Promise<IPostWithCarAndUser<ICar, IUser>> {
    const car = await carRepository.getById(deletedPost.car_id);
    if (!car) {
      throw new ApiError(statusCode.NOT_FOUND, errorMessages.CAR_NOT_FOUND);
    }
    const {
      rates: { usd, eur },
    } = await currencyService.getExchangeRates();

    const prices = await currencyService.calculatePrices(
      car.enteredPrice,
      car.enteredCurrency,
      usd,
      eur,
    );
    await carRepository.updateById(car._id, { prices });

    const post = await postRepository.updateById(deletedPost._id, {
      isDeleted: false,
      status: EPostStatus.ACTIVE,
    });
    return await this.fetchCarAndUserForPost(post);
  }
  public async updatePostAfterProfanity(
    oldPost: IPostBasic,
    carToUpdate: Partial<ICar>,
  ): Promise<IPostWithCarAndUser<ICar, IUser>> {
    const isProfanityPresent = profanityService.checkForProfanity(carToUpdate);

    const updatedCar = await carRepository.updateById(oldPost.car_id, {
      ...carToUpdate,
    });
    const user = await userRepository.getById(oldPost.user_id);
    let updatedPost: IPostBasic;

    if (isProfanityPresent) {
      const sumOfProfanityEdits = oldPost.profanityEdits + 1;
      updatedPost = await postRepository.updateById(oldPost._id, {
        profanityEdits: sumOfProfanityEdits,
      });
      await emailService.sendByEmailType(
        EEmailType.POST_PROFANITY_DETECTED_FOR_USER,
        {
          firstName: user.firstName,
          numberOfAttempts: config.MAX_PROFANITY_EDITS - sumOfProfanityEdits,
        },
        user.email,
      );
      if (sumOfProfanityEdits >= config.MAX_PROFANITY_EDITS) {
        await emailService.sendByEmailType(
          EEmailType.POST_PROFANITY_DETECTED_FOR_MANAGER,
          {
            postId: oldPost._id,
            numberOfAttempts: config.MAX_PROFANITY_EDITS,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            submissionDate: TimeHelper.getCurrentDate(),
          },
          config.MANAGER_EMAIL,
        );
      }
    } else {
      updatedPost = await postRepository.updateById(oldPost._id, {
        profanityEdits: 0,
        status: EPostStatus.ACTIVE,
      });
    }
    return {
      car: updatedCar,
      user,
      _id: updatedPost._id,
      status: updatedPost.status,
      profanityEdits: updatedPost.profanityEdits,
      isDeleted: updatedPost.isDeleted,
      createdAt: updatedPost.createdAt,
      updatedAt: updatedPost.updatedAt,
    };
  }
  public async getPostsWithProfanity(
    query: IQuery,
  ): Promise<IListResponse<IPostWithCarAndUser<ICar, IUser>>> {
    const posts = await postRepository.getAll(
      query,
      { status: EPostStatus.NOT_ACTIVE, isDeleted: false },
      false,
    );
    const postsWithInfo = await Promise.all(
      posts.data.map(async (post) => await this.fetchCarAndUserForPost(post)),
    );

    return {
      page: posts.page,
      limit: posts.limit,
      total: posts.total,
      data: postsWithInfo,
    };
  }
  public async getPostWithProfanityById(
    postId: string,
  ): Promise<IPostWithCarAndUser<ICar, IUser>> {
    const post = await postRepository.findOneByParams({
      _id: postId,
      status: EPostStatus.NOT_ACTIVE,
      isDeleted: false,
    });

    if (!post) {
      throw new ApiError(statusCode.NOT_FOUND, errorMessages.POST_NOT_FOUND);
    }
    return await this.fetchCarAndUserForPost(post);
  }
  public async saveView(postId: string): Promise<void> {
    await viewRepository.save(postId);
  }
  public async getPostInfo(
    post: IPostBasic,
  ): Promise<{ post: IPostBasic; info: IPostInfo }> {
    const viewsPerDay: ITimePeriod = {
      label: ETimeLabel.VIEWS_PER_DAY,
      amount: 24,
      unit: "hours",
    };
    const viewsPerWeek: ITimePeriod = {
      label: ETimeLabel.VIEWS_PER_WEEK,
      amount: 7,
      unit: "days",
    };
    const viewsPerMonth: ITimePeriod = {
      label: ETimeLabel.VIEWS_PER_MONTH,
      amount: 1,
      unit: "month",
    };
    const views = await viewRepository.getViewsByTimeFrame(post._id, [
      viewsPerDay,
      viewsPerWeek,
      viewsPerMonth,
    ]);

    const car = await carRepository.getById(post.car_id);
    const avgPrice = await carRepository.getAveragePrice(car.enteredCurrency);
    const avgPriceByCarRegion = await carRepository.getAveragePriceByRegion(
      car.region,
      car.enteredCurrency,
    );
    return {
      post,
      info: {
        ...views,
        avgPrice,
        avgPriceByCarRegion,
        currency: car.enteredCurrency,
      },
    };
  }
  private async fetchCarAndUserForPost(
    post: IPostBasic,
  ): Promise<IPostWithCarAndUser<ICar, IUser>> {
    const car = await carRepository.getById(post.car_id);
    const user = await userRepository.getById(post.user_id);
    if (!car) {
      throw new ApiError(statusCode.NOT_FOUND, errorMessages.CAR_NOT_FOUND);
    }

    if (!user) {
      throw new ApiError(statusCode.NOT_FOUND, errorMessages.USER_NOT_FOUND);
    }
    return {
      _id: post._id,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      status: post.status,
      profanityEdits: post.profanityEdits,
      isDeleted: post.isDeleted,
      user,
      car,
    };
  }
}

export const postService = new PostService();

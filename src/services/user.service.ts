import { errorMessages } from "../constants/error-messages.constant";
import { statusCode } from "../constants/status-codes.constant";
import { EAccountType } from "../enums/account-type.enum";
import { ApiError } from "../errors/api-error";
import { ITokenDB, ITokenResponse } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import {authService} from "./auth.service";
import {postRepository} from "../repositories/post.repository";
import {carRepository} from "../repositories/car.repository";

class UserService {
  public async getUsers(): Promise<IUser[]> {
    return await userRepository.getAll();
  }
  public async getUser(userId: string): Promise<IUser> {
    return await this.findUserOrThrow(userId);
  }
  public async getMe(userId: string): Promise<IUser> {
    return await this.findUserOrThrow(userId);
  }
  public async deleteMe(userId: string): Promise<void> {
    console.log(userId)
    await this.findUserOrThrow(userId);
    await tokenRepository.deleteManyByParams({ _userId: userId });
    const posts = await postRepository.findByParams({user_id: userId});
    if (posts)  {
    await Promise.all(
         posts.map(async (post)=>{
           await carRepository.deleteById(post.car_id)
         })
     )
    }
    await postRepository.deleteManyByParams({user_id: userId})
    await userRepository.deleteById(userId);
  }
  public async updateMe(userId: string, data: Partial<IUser>): Promise<IUser> {
    const user = await this.findUserOrThrow(userId);
    return await userRepository.updateById(user._id, data);
  }
  public async upgradeToPremium(
    userId: string,
    oldTokenPair: ITokenDB,
  ): Promise<{ user: IUser; tokens?: ITokenResponse }> {
    const user = await this.findUserOrThrow(userId);
    if (user.accountType === EAccountType.PREMIUM) {
      return { user };
    }
    const updatedUser = await userRepository.updateById(user._id, {
      accountType: EAccountType.PREMIUM,
    });
    await tokenRepository.deleteById(oldTokenPair._id);
    const tokens = await authService.generateTokens(updatedUser);
    return {
      user: updatedUser,
      tokens,
    };
  }
  private async findUserOrThrow(userId: string): Promise<IUser> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError(statusCode.NOT_FOUND, errorMessages.USER_NOT_FOUND);
    }
    return user;
  }
}

export const userService = new UserService();

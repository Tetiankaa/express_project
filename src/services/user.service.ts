import { errorMessages } from "../constants/error-messages.constant";
import { statusCode } from "../constants/status-codes.constant";
import { EAccountType } from "../enums/account-type.enum";
import { ApiError } from "../errors/api-error";
import { ITokenDB, ITokenResponse } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { tokenService } from "./token.service";

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
    await this.findUserOrThrow(userId);
    await tokenRepository.deleteByParams({ _userId: userId });
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
    const newTokens = tokenService.generateTokenPair({
      _userId: updatedUser._id,
      role: updatedUser.role,
      accountType: updatedUser.accountType,
    });
    await tokenRepository.create({
      _userId: updatedUser._id,
      refreshToken: newTokens.refreshToken,
      accessToken: newTokens.accessToken,
    });
    return {
      user: updatedUser,
      tokens: newTokens,
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

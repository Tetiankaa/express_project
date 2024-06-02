import { config } from "../configs/config";
import { errorMessages } from "../constants/error-messages.constant";
import { statusCode } from "../constants/status-codes.constant";
import { EActionTokenType } from "../enums/action-token-type.enum";
import { EEmailType } from "../enums/email-type.enum";
import { ERole } from "../enums/role.enum";
import { ApiError } from "../errors/api-error";
import {
  IAuthCredentials,
  IChangePassword,
  IForgotPassword,
  ISetPassword,
} from "../interfaces/auth.interface";
import { ITokenResponse } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async signUp(
    user: Partial<IUser>,
  ): Promise<{ user: IUser; tokens: ITokenResponse }> {
    const hashedPassword = await passwordService.hash(user.password);
    const newUser = await userRepository.create({
      ...user,
      email: user.email.toLowerCase(),
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(newUser);
    return {
      user: newUser,
      tokens,
    };
  }

  public async signIn(
    credentials: IAuthCredentials,
  ): Promise<{ user: IUser; tokens: ITokenResponse }> {
    const user = await userRepository.findByParams({
      email: credentials.email.toLowerCase(),
    });
    if (!user) {
      this.throwWrongCredentialsError();
    }

    const isMatched = await passwordService.compare(
      credentials.password,
      user.password,
    );
    if (!isMatched) {
      this.throwWrongCredentialsError();
    }
    const tokens = await this.generateTokens(user);
    return {
      user,
      tokens,
    };
  }
  public async refresh(
    userId: string,
    oldTokenId: string,
  ): Promise<ITokenResponse> {
    const user = await userRepository.findByParams({ _id: userId });
    await tokenRepository.deleteById(oldTokenId);

    return await this.generateTokens(user);
  }
  public async createManagerAccount(body: Partial<IUser>): Promise<IUser> {
    const hashedPassword = await passwordService.hash(
      config.DEFAULT_MANAGER_PASSWORD,
    );

    const manager = await userRepository.create({
      ...body,
      password: hashedPassword,
      role: ERole.MANAGER,
    });
    const actionToken = tokenService.generateActionToken(
      { _userId: manager._id, role: manager.role },
      EActionTokenType.SETUP_MANAGER,
    );

    await actionTokenRepository.create({
      token: actionToken,
      user_id: manager._id,
      tokenType: EActionTokenType.SETUP_MANAGER,
    });
    // await emailService.sendByEmailType(
    //   EEmailType.SETUP_MANAGER_PASSWORD,
    //   {
    //     frontUrl: config.FRONT_URL,
    //     fullName: `${manager.firstName} ${manager.lastName}`,
    //     actionToken,
    //   },
    //   manager.email,
    // );
    return manager;
  }
  public async setManagerPassword(
    password: string,
    userId: string,
    actionTokenId: string,
  ): Promise<void> {
    const manager = await userRepository.getById(userId);
    const hashedPassword = await passwordService.hash(password);
    await userRepository.updateById(manager._id, {
      password: hashedPassword,
    });
    return await actionTokenRepository.deleteByParams({ _id: actionTokenId });
  }
  public async changePassword(
    dto: IChangePassword,
    userId: string,
  ): Promise<void> {
    const user = await userRepository.getById(userId);
    const isMatched = await passwordService.compare(
      dto.oldPassword,
      user.password,
    );
    if (!isMatched) {
      throw new ApiError(
        statusCode.BAD_REQUEST,
        errorMessages.WRONG_OLD_PASSWORD,
      );
    }
    const hashedPassword = await passwordService.hash(dto.newPassword);
    await userRepository.updateById(userId, { password: hashedPassword });

    await tokenRepository.deleteManyByParams({ _userId: userId });
  }
  public async forgotPassword(dto: IForgotPassword): Promise<void> {
    const { email } = dto;
    const user = await userRepository.findByParams({ email });
    if (!user) return;
    const actionToken = tokenService.generateActionToken(
      { _userId: user._id, role: user.role, accountType: user.accountType },
      EActionTokenType.FORGOT_PASSWORD,
    );
    await actionTokenRepository.create({
      token: actionToken,
      user_id: user._id,
      tokenType: EActionTokenType.FORGOT_PASSWORD,
    });
    await emailService.sendByEmailType(
      EEmailType.FORGOT_PASSWORD,
      {
        email,
        actionToken,
        fullName: `${user.firstName} ${user.lastName}`,
        frontUrl: config.FRONT_URL,
      },
      user.email,
    );
  }
  public async setForgotPassword(
    newPassword: ISetPassword,
    userId: string,
    actionTokenId: string,
  ): Promise<void> {
    const user = await userRepository.getById(userId);
    const hashedPassword = await passwordService.hash(newPassword.password);
    await userRepository.updateById(user._id, { password: hashedPassword });
    await actionTokenRepository.deleteByParams({ _id: actionTokenId });
    await tokenRepository.deleteManyByParams({ _userId: userId });
  }
  private throwWrongCredentialsError(): never {
    throw new ApiError(
      statusCode.UNAUTHORIZED,
      errorMessages.WRONG_EMAIL_OR_PASSWORD,
    );
  }
  public async generateTokens(user: IUser): Promise<ITokenResponse> {
    const tokens = tokenService.generateTokenPair({
      _userId: user._id,
      role: user.role,
      accountType: user.accountType,
    });

    await tokenRepository.create({
      ...tokens,
      _userId: user._id,
    });
    return tokens;
  }
}

export const authService = new AuthService();

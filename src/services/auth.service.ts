import { errorMessages } from "../constants/error-messages.constant";
import { statusCode } from "../constants/status-codes.constant";
import { ApiError } from "../errors/api-error";
import { IAuthCredentials } from "../interfaces/auth.interface";
import { ITokenResponse } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async signUp(
    user: Partial<IUser>,
  ): Promise<{ user: IUser; tokens: ITokenResponse }> {
    const hashedPassword = await passwordService.hash(user.password);
    const newUser = await userRepository.create({
      ...user,
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
      email: credentials.email,
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

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

    const tokens = tokenService.generateTokenPair({
      _userId: newUser._id,
      role: newUser.role,
      accountType: newUser.accountType,
    });

    await tokenRepository.create({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _userId: newUser._id,
    });
    return {
      user: newUser,
      tokens,
    };
  }
}

export const authService = new AuthService();

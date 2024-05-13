import { ITokenDB } from "../interfaces/token.interface";
import { Token } from "../models/token.module";

class TokenRepository {
  public async create(data: ITokenDB): Promise<ITokenDB> {
    return await Token.create(data);
  }
}

export const tokenRepository = new TokenRepository();

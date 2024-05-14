import { FilterQuery } from "mongoose";

import { ITokenDB } from "../interfaces/token.interface";
import { Token } from "../models/token.module";

class TokenRepository {
  public async create(data: ITokenDB): Promise<ITokenDB> {
    return await Token.create(data);
  }
  public async findByParams(params: FilterQuery<ITokenDB>): Promise<ITokenDB> {
    return await Token.findOne(params);
  }
}

export const tokenRepository = new TokenRepository();

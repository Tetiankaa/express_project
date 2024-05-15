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
  public async deleteById(id: string): Promise<void> {
    await Token.deleteOne({ _id: id });
  }
  public async deleteByParams(params: FilterQuery<ITokenDB>): Promise<void> {
    await Token.findOneAndDelete(params);
  }
}

export const tokenRepository = new TokenRepository();

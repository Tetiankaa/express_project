import { FilterQuery } from "mongoose";

import { IActionToken } from "../interfaces/action-token.interface";
import { ActionToken } from "../models/action-token.model";

class ActionTokenRepository {
  public async create(data: IActionToken): Promise<IActionToken> {
    return await ActionToken.create(data);
  }
  public async deleteByParams(
    params: FilterQuery<IActionToken>,
  ): Promise<void> {
    await ActionToken.deleteOne(params);
  }
  public async findByParams(
    params: FilterQuery<IActionToken>,
  ): Promise<IActionToken> {
    return await ActionToken.findOne(params);
  }
}

export const actionTokenRepository = new ActionTokenRepository();

import { FilterQuery } from "mongoose";

import { IUser } from "../interfaces/user.interface";
import { User } from "../models/user.module";

class UserRepository {
  public async create(user: Partial<IUser>): Promise<IUser> {
    return await User.create(user);
  }

  public async findByParams(params: FilterQuery<IUser>): Promise<IUser> {
    return await User.findOne(params);
  }
}

export const userRepository = new UserRepository();

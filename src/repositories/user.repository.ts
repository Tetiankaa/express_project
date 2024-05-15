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
  public async getAll(): Promise<IUser[]> {
    return await User.find();
  }
  public async getById(id: string): Promise<IUser> {
    return await User.findOne({ _id: id });
  }
  public async deleteById(id: string): Promise<void> {
    await User.deleteOne({ _id: id });
  }
  public async updateById(id: string, data: Partial<IUser>): Promise<IUser> {
    return await User.findOneAndUpdate({ _id: id }, data, {
      returnDocument: "after",
    });
  }
}

export const userRepository = new UserRepository();

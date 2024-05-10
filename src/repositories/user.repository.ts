import {IUser} from "../interfaces/user.interface";
import {User} from "../models/user.module";

class UserRepository {
    public async create(user: IUser): Promise<IUser> {
        return User.create(user);
    }
}

export const userRepository = new UserRepository();

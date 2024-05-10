import {IUser, IUserDTO} from "../interfaces/user.interface";

class AuthService {
    public async signUp(user: Partial<IUser>):Promise<IUser> {

    }

}

export const authService = new AuthService();

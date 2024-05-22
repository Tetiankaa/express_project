import { EAccountType } from "../enums/account-type.enum";
import { ERole } from "../enums/role.enum";

export interface IUser {
  _id: string;
  email: string;
  password?: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: ERole;
  accountType: EAccountType;
}
export interface IUserDTO {
  _id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role?: ERole;
  accountType?: EAccountType;
}

import { EAccountType } from "../enums/account-type.enum";
import { ERole } from "../enums/role.enum";

export interface IJwtPayload {
  _userId: string;
  role: ERole;
  accountType: EAccountType;
}

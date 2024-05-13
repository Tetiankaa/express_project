import { EAccountType } from "../enums/account.enum";
import { ERole } from "../enums/role.enum";

export interface JwtPayloadInterface {
  _userId: string;
  role: ERole;
  accountType: EAccountType;
}

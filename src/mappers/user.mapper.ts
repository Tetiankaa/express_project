import { IUser, IUserDTO } from "../interfaces/user.interface";

export class UserMapper {
  public static toDto(user: IUser): IUserDTO {
    return {
      _id: user._id,
      email: user.email,
      accountType: user.accountType,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
    };
  }
  public static toListDto(users: IUser[]): IUserDTO[] {
    return users.map(UserMapper.toDto);
  }

  public static toUser(dto: IUserDTO): IUser {
    return {
      _id: dto._id,
      email: dto.email,
      accountType: dto.accountType,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      role: dto.role,
    };
  }
}

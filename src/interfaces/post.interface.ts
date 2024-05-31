import { EPostStatus } from "../enums/post-status.enum";

export interface IPostBasic {
  _id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
  user_id?: string;
  car_id?: string;
  status?: EPostStatus;
  profanityEdits?: number;
}
export interface IPostWithCarAndUser<T1, T2> extends IPostBasic {
  car: T1;
  user: T2;
}


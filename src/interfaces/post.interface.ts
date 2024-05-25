import { EPostStatus } from "../enums/post-status.enum";

export interface IPostBasic {
  _id: string;
  createdAt: string;
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

export interface IPagination {
  total: number;
  page: number;
  limit: number;
}
export interface IPostResponse<T> extends IPagination {
  data: T[];
}

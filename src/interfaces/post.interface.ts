import { EPostStatus } from "../enums/post-status.enum";
import {ICar, ICarDto} from "./car.interface";

export interface IPostBasic {
  _id: string;
  user_id?: string;
  createdAt: string;
}

export interface IPostDetails extends IPostBasic {
  car_id: string;
  status: EPostStatus;
  profanityEdits: number;
}
export interface IPostWithCar extends IPostBasic {
  car: ICar;
}
export interface IPostWithCarDto extends IPostBasic {
  car: ICarDto;
}
export interface IPagination {
  total: number;
  page: number;
  limit: number;
}
export interface IPostResponse<T> extends IPagination {
  data: T[];
}

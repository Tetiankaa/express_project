import { EPostStatus } from "../enums/post-status.enum";

export interface IPost {
  _id: string;
  user_id: string;
  car_id: string;
  status: EPostStatus;
  profanityEdits: number;
}

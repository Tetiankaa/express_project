import { ECurrency } from "../enums/currency.enum";
import { EPostStatus } from "../enums/post-status.enum";

export interface ICar {
  _id: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  region: string;
  city: string;
  color: string;
  currency: ECurrency;
  price: number;
  description: string;
  photo: string;
}
export interface ICarDto {
  _id: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  region: string;
  city: string;
  color: string;
  currency: ECurrency;
  price: number;
  description: string;
  photo: string;
}
export interface ICarResponse {
  car: ICar;
  status: EPostStatus;
  profanityEdits: number;
}

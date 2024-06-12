import { ECurrency } from "../enums/currency.enum";
import { EPostStatus } from "../enums/post-status.enum";
import {IPrice} from "./price.interface";

export interface ICar {
  _id: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  region: string;
  city: string;
  color: string;
  enteredCurrency: ECurrency;
  enteredPrice: number;
  description: string;
  photo: string;
  prices?: IPrice[];
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
  enteredCurrency: ECurrency;
  enteredPrice: number;
  description: string;
  photo: string;
  prices?: IPrice[];
}
export interface ICarResponse {
  car: ICar;
  status: EPostStatus;
  profanityEdits: number;
}

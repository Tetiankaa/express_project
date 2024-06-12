import { ECurrency } from "../enums/currency.enum";

export interface IPrice {
  currency: ECurrency;
  value: number;
}

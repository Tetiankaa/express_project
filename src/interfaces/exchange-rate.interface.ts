export interface IExchangeRate {
  base_ccy: string;
  ccy: string;
  buy: number;
  sale: number;
  createdAt?: Date;
}
export interface IExchangeRateAPI {
  base_ccy: string;
  ccy: string;
  buy: string;
  sale: string;
}

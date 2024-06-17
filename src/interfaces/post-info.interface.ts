import { ECurrency } from "../enums/currency.enum";

export interface IPostInfo {
  totalViews: number;
  avgPrice: number;
  avgPriceByCarRegion: number;
  currency: ECurrency;
  [key: string]: number | string | null;
}

import { ICarModel } from "./carModel.interface";

export interface IBrandModels {
  _id: string;
  name: string;
  models: ICarModel[];
}

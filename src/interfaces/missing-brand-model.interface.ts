export interface IMissingBrandModel {
  _id: string;
  _userId: string;
  brand: string;
  model: string;
  email: string;
  fullName: string;
  notes: string;
  isResolved?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface IMissingBrandModelDto {
  _id: string;
  _userId: string;
  brand: string;
  model: string;
  email: string;
  fullName: string;
  notes: string;
  isResolved: boolean;
  createdAt?: string;
  updatedAt?: string;
}

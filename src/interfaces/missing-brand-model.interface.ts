export interface IMissingBrandModel {
  _userId: string;
  brand: string;
  model: string;
  email: string;
  fullName: string;
  notes: string;
  isResolved?: boolean;
  createdAt?: string;
}
export interface IMissingBrandModelDto {
  _userId: string;
  brand: string;
  model: string;
  email: string;
  fullName: string;
  notes: string;
  isResolved: boolean;
  createdAt?: string;
}

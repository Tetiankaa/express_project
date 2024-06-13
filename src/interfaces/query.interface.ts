import { EOrder } from "../enums/order.enum";
import { EPostOrderBy } from "../enums/post-order.enum";

export interface IQuery {
  page?: number;
  limit?: number;
  isResolved?: boolean;
  isDeleted?: boolean;
  updatedAt?: Date;
  order?: EOrder;
  orderBy?: EPostOrderBy;
  profanityEdits?: number;
}

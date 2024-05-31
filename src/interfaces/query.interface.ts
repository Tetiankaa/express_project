export interface IQuery {
  page?: number;
  limit?: number;
  isResolved?: boolean;
  isDeleted?: boolean;
  postId?: string;
}

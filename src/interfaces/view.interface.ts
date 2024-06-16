export interface IView {
  post_id: string;
  createdAt: string;
}
export interface IViewStatistics {
  totalViews: number;
  [key: string]: number | null;
}

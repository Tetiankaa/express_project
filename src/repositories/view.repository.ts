import { IView } from "../interfaces/view.interface";
import { View } from "../models/view.module";

class ViewRepository {
  public async save(postId: string): Promise<IView> {
    return await View.create({ post_id: postId });
  }
}

export const viewRepository = new ViewRepository();

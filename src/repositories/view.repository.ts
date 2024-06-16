import { PipelineStage, Types } from "mongoose";

import { TimeHelper } from "../helpers/time.helper";
import { ITimeFrame, ITimePeriod } from "../interfaces/time-periods.interface";
import { IView, IViewStatistics } from "../interfaces/view.interface";
import { View } from "../models/view.module";

class ViewRepository {
  public async save(postId: string): Promise<IView> {
    return await View.create({ post_id: postId });
  }
  public async getViewsByTimeFrame(
    postId: string,
    timePeriods: ITimePeriod[],
  ): Promise<IViewStatistics> {
    const timeFrames: ITimeFrame[] = timePeriods.map((period) => ({
      label: period.label,
      date: TimeHelper.subtractByParams(period.amount, period.unit),
    }));
    const pipeline: PipelineStage[] = [
      {
        $match: {
          post_id: new Types.ObjectId(postId),
        },
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: 1 },
          ...timeFrames.reduce(
            (acc, frame) => {
              acc[frame.label] = {
                $sum: { $cond: [{ $gte: ["$createdAt", frame.date] }, 1, 0] },
              };
              return acc;
            },
            {} as Record<string, any>,
          ),
        },
      },
    ];

    const result = await View.aggregate(pipeline);
    return result[0];
  }
}

export const viewRepository = new ViewRepository();

import { ManipulateType } from "dayjs";

import { ETimeLabel } from "../enums/time-label.enum";

export interface ITimePeriod {
  label: ETimeLabel;
  amount: number;
  unit: ManipulateType;
}

export interface ITimeFrame extends Pick<ITimePeriod, "label"> {
  date: Date;
}

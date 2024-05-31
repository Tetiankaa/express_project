import dayjs, { ManipulateType } from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export class TimeHelper {
  public static subtractByParams(value: number, unit: ManipulateType): Date {
    return dayjs().subtract(value, unit).toDate();
  }
  public static getCurrentDate(): string {
    return dayjs().format("YYYY-MM-DD HH:mm:ss");
  }
}

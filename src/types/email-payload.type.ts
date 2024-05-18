import { EEmailType } from "../enums/email-type.enum";
import { EmailCombinedPayloadType } from "./email-combined-payload.type";
import { PickRequiredType } from "./pick-required.type";

export type EmailPayloadType = {
  [EEmailType.MISSING_BRAND_MODEL]: PickRequiredType<
    EmailCombinedPayloadType,
    "model" | "brand" | "email" | "notes" | "fullName"
  >;
};

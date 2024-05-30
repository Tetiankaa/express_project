import { EEmailType } from "../enums/email-type.enum";
import { EmailCombinedPayloadType } from "./email-combined-payload.type";
import { PickRequiredType } from "./pick-required.type";

export type EmailPayloadType = {
  [EEmailType.MISSING_BRAND_MODEL]: PickRequiredType<
    EmailCombinedPayloadType,
    "model" | "brand" | "email" | "notes" | "fullName"
  >;
  [EEmailType.MISSING_BRAND_MODEL_ADDED]: PickRequiredType<
    EmailCombinedPayloadType,
    "model" | "brand" | "fullName"
  >;
  [EEmailType.POST_PROFANITY_DETECTED]: PickRequiredType<
    EmailCombinedPayloadType,
    "firstName" | "numberOfAttempts"
  >;
};

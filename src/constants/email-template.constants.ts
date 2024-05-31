import { EEmailType } from "../enums/email-type.enum";

export const emailTemplateConstants = {
  [EEmailType.MISSING_BRAND_MODEL]: {
    templateId: "d-fbb46cca0be440dfbda736f618ff4187",
  },
  [EEmailType.MISSING_BRAND_MODEL_ADDED]: {
    templateId: "d-aa5dfeaf26b84aef9c2bd89f298f7890",
  },
  [EEmailType.POST_PROFANITY_DETECTED_FOR_USER]: {
    templateId: "d-3f10deacc3ae43e69f77f339aa7a78dc",
  },
  [EEmailType.POST_PROFANITY_DETECTED_FOR_MANAGER]: {
    templateId: "d-21c98ae6efc94843bd48ff6cb14f7bf7",
  },
};

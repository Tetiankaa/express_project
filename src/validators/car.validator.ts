import dayjs from "dayjs";
import Joi from "joi";

import { ECurrency } from "../enums/currency.enum";

export class CarValidator {
  private static baseStringValidation = Joi.string().min(2).max(40).messages({
    "string.empty": "{#label} cannot be empty",
    "string.min": "{#label} must be at least {#limit} characters long.",
    "string.max": "{#label} must be at most {#limit} characters long.",
    "any.required": "{#label} is a required field.",
  });
  private static carFieldValidation = CarValidator.baseStringValidation
    .pattern(/^[a-zA-Z0-9\s\-&\.]+$/)
    .messages({
      "string.pattern.base":
        "{#label} can only contain letters, numbers, spaces, hyphens, ampersands, and periods.",
    });
  private static description = CarValidator.baseStringValidation
    .max(300)
    .messages({
      "string.max": "{#label} must be at most {#limit} characters long.",
    });
  private static numericFieldValidation = Joi.number().positive().messages({
    "number.base": "{#label} must be a number.",
    "number.positive": "{#label} must be a positive number.",
    "any.required": "{#label} is a required field.",
  });
  private static year = this.numericFieldValidation
    .max(dayjs().year())
    .min(1990)
    .messages({
      "number.min": "{#label} must be greater than or equal to {#limit}",
      "number.max": "{#label} must be less than or equal {#limit}",
    });
  private static currency = Joi.string()
    .valid(...Object.values(ECurrency))
    .messages({
      "any.required": "{#label} is a required field.",
      "any.only": "{#label} must be one of the following values: {#valids}",
    });

  public static create = Joi.object({
    brand: this.carFieldValidation.label("Brand").required(),
    model: this.carFieldValidation.label("Model").required(),
    region: this.baseStringValidation.label("Region").required(),
    city: this.baseStringValidation.label("City").required(),
    color: this.baseStringValidation.label("Color").required(),
    description: this.description.label("Description").required(),
    price: this.numericFieldValidation.label("Price").required(),
    mileage: this.numericFieldValidation.label("Mileage").required(),
    year: this.year.label("Year").required(),
    currency: this.currency.label("Currency").required(),
  });
}

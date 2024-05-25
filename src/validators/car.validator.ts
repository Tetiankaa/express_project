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
  private static email = Joi.string()
    .pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)
    .messages({
      "string.pattern.base":
        "{#label} address must be in a valid format (Example: user@example.com)",
      "string.empty": "{#label} cannot be an empty field",
      "any.required": "{#label} is a required field",
    });

  public static create = Joi.object({
    brand: this.carFieldValidation.required(),
    model: this.carFieldValidation.required(),
    region: this.baseStringValidation.required(),
    city: this.baseStringValidation.required(),
    color: this.baseStringValidation.required(),
    description: this.description.required(),
    price: this.numericFieldValidation.required(),
    mileage: this.numericFieldValidation.required(),
    year: this.year.required(),
    currency: this.currency.required(),
  });
  public static reportMissingBrandModel = Joi.object({
    brand: this.carFieldValidation.required(),
    model: this.carFieldValidation.required(),
    email: this.email.required(),
    fullName: this.baseStringValidation,
    notes: this.description,
  });
  public static createMissingBrandModel = Joi.object({
    brand: this.carFieldValidation.required(),
    model: this.carFieldValidation.required(),
  });
  public static update = Joi.object({
    brand: this.carFieldValidation,
    model: this.carFieldValidation,
    region: this.baseStringValidation,
    city: this.baseStringValidation,
    color: this.baseStringValidation,
    description: this.description,
    price: this.numericFieldValidation,
    mileage: this.numericFieldValidation,
    year: this.year,
    currency: this.currency,
  });
}

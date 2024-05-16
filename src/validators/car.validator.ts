import Joi from "joi";

export class CarValidator {
    private static baseStringValidation  = Joi.string().min(2).max(40).messages({
        "string.empty": "{#label} cannot be empty",
        "string.min":"{#label} must be at least 2 characters long.",
        "string.max": "{#label} must be at most 30 characters long.",
        "any.required": "{#label} is a required field."
    })
    private static carFieldValidation = CarValidator.baseStringValidation.pattern(/^[a-zA-Z0-9\s\-&\.]+$/).messages({
        "string.pattern.base": "{#label} can only contain letters, numbers, spaces, hyphens, ampersands, and periods.",
    })
    private static numericFieldValidation = Joi.number().positive().messages({
        "number.base": "{#label} must be a number.",
        "number.positive": "{#label} must be a positive number.",
        "any.required": "{#label} is a required field."
    })

    public static create = Joi.object({
        brand: this.carFieldValidation.label("Brand").required(),
        model: this.carFieldValidation.label("Model").required(),
        region: this.baseStringValidation.label("Region").required(),
        city: this.baseStringValidation.label("City").required(),
        color: this.baseStringValidation.label("Color").required(),
        description: this.baseStringValidation.label("Description").max(300).required(),
        price: this.numericFieldValidation.label("Price").required(),
        mileage: this.numericFieldValidation.label("Mileage").required()
    })
}

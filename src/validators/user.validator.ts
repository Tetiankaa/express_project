import Joi from "joi";

export class UserValidator {
  private static firstName = Joi.string().alphanum().min(2).max(50).messages({
    "string.min": "First name length must be at least 2 characters long",
    "string.max": "First name length must be maximum 30 characters long",
    "string.empty": "First name cannot be an empty field",
    "any.required": "First name is a required field",
  });
  private static lastName = Joi.string().alphanum().min(2).max(50).messages({
    "string.min": "Last name length must be at least 2 characters long",
    "string.max": "Last name length must be maximum 30 characters long",
    "string.empty": "Last name cannot be an empty field",
  });
  private static email = Joi.string()
    .pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)
    .messages({
      "string.pattern.base":
        "Email address must be in a valid format (Example: user@example.com)",
      "string.empty": "Email cannot be an empty field",
      "any.required": "Email is a required field",
    });
  private static password = Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    .messages({
      "string.pattern.base":
        "Password must have minimum 8 characters, at least one lowercase  letter, one uppercase letter and at least one digit",
      "string.empty": "Password cannot be an empty field",
      "any.required": "Password is a required field",
    });
  private static phone = Joi.string()
    .pattern(/^\+\d{3}\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/)
    .messages({
      "string.pattern.base":
        "Invalid phone number. (Example: +380 12 345 67 89)",
      "string.empty": "Phone number cannot be an empty field",
      "any.required": "Phone number is a required field",
    });
  public static register = Joi.object({
    email: this.email.required(),
    password: this.password.required(),
    phone: this.phone.required(),
    firstName: this.firstName.required(),
    lastName: this.lastName,
  });

  public static login = Joi.object({
    email: this.email.required(),
    password: this.password.required(),
  });
  public static update = Joi.object({
    phone: this.phone,
    firstName: this.firstName,
    lastName: this.lastName,
  });
  public static createManager = Joi.object({
    email: this.email.required(),
    phone: this.phone.required(),
    firstName: this.firstName.required(),
    lastName: this.lastName.required(),
  });
  public static setPassword = Joi.object({
    password: this.password.required(),
  });
  public static changePassword = Joi.object({
    oldPassword: this.password.required(),
    newPassword: this.password.required(),
  });
}

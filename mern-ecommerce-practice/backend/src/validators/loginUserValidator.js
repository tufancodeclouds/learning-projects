import { body } from "express-validator";

const loginUserValidator = [
  // Email validation
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail() // Stop further validations if this fails
    .isEmail()
    .withMessage("Invalid email format"),

  // Password validation
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .matches(/^(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one digit or special character, and be at least 8 characters long"
    ),
];

export { loginUserValidator };

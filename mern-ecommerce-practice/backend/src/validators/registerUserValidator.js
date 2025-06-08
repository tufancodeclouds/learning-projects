import { body } from "express-validator";

const registerUserValidator = [
  // Fullname validation
  body("name")
    .trim() // Trim whitespace from the fullname
    .notEmpty() // Fullname is required
    .withMessage("Name is required")
    .bail() // Stop further validations if this fails
    .isLength({ min: 3 }) // Ensure fullname is at least 3 characters long
    .withMessage("Name must be at least 3 characters long"),

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
    .bail() // Stop further validations if this fails
    .matches(/^(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one digit or special character, and be at least 8 characters long"
    ),
];

export { registerUserValidator };
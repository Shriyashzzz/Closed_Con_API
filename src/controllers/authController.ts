import bcrypt from "bcryptjs";
import type { NextFunction, Request, Response } from "express";
import { validationResult, matchedData, body } from "express-validator";
import { AppError } from "../util/error.js";

const signUpValidation = [
  body("username")
    .notEmpty()
    .isLength({ max: 15, min: 4 })
    .withMessage(
      "Username needs to have atleast 4 charachters and less than 15 charachters",
    ),
  body("password")
    .notEmpty()
    .isLength({ min: 4 })
    .withMessage("Password needs to have atleast 4 charachters long"),

  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Invalid email")
    .custom((val) => {
      //search db to ensure the email is unique
    }),
  body("dob").isDate().notEmpty().withMessage("Invalid Date"),
  body("username")
    .notEmpty()
    .isAlpha()
    .withMessage("Invalid Username")
    .custom((val, { req }) => {
      //search db to ensure the username is unique, if not throw error else return true
    }),
];

// handles new user sign ups
const authSignup = [
  ...signUpValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: "Inavlid Payload",
        error: { message: errors.array() },
      });
    }
    const { email, username, password, dob } = matchedData(req);
    const crypticPassword = await bcrypt.hash(password, 10);
  },
];

//handles auth login response after passport successfully verifies the incoming payload
const authLogin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user)
    return next(
      new AppError("Passport Error assigning user to req.user", 500, false),
    );
  const userResponseData: UserResponsePayload = {
    email: req.user.email,
    id: req.user.id,
    role: req.user.role,
    createdAt: req.user.createdAt,
  };
  res.json({ user: userResponseData });
};

export { authSignup, authLogin };

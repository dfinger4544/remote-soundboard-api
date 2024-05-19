import express from "express";
import { body } from "express-validator";

const router = express.Router();

import * as authCtrl from "../controllers/authController";
import isAuth from "../middleware/is-auth";

// POST login
router.post(
  "/login",
  [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ],
  authCtrl.login
);

// POST create user
router.post(
  "/user",
  isAuth,
  [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("password").trim().notEmpty().withMessage("password is required"),
    body("password")
      .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
      .withMessage(
        "Password must be a minimum eight characters, at least one letter, one number, and one special character"
      ),
    body("passwordConfirm")
      .trim()
      .notEmpty()
      .withMessage("password must be confirmed"),
    body("passwordConfirm")
      .custom((value, { req }) => {
        return value === req.body.password;
      })
      .withMessage("Password confirmation does not match"),
  ],
  authCtrl.createUser
);

// POST update user password
router.post(
  "/user/updatePassword",
  isAuth,
  [
    body("currentPassword")
      .trim()
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("New password is required"),

    body("newPassword")
      .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
      .withMessage(
        "New password must be a minimum eight characters, at least one letter, one number, and one special character"
      ),
    body("newPasswordConfirm")
      .trim()
      .notEmpty()
      .withMessage("New password must be confirmed"),
    body("newPasswordConfirm")
      .custom((value, { req }) => {
        return value === req.body.newPassword;
      })
      .withMessage("Password confirmation does not match"),
  ],
  authCtrl.updatePassword
);

export default router;

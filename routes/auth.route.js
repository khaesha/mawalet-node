const express = require("express");
const { body } = require("express-validator/check");

const router = express.Router();

const authController = require("../controllers/auth.controller");
const User = require("../models/user.model");

// router.post(
//   "/getToken",
//   [
//     body("email")
//       .trim()
//       .isEmail()
//       .withMessage("Invalid email format"),
//     body("password")
//       .trim()
//       .isLength({ min: 5 })
//       .withMessage("Must be at least 5 chars long")
//   ],
//   authController.getToken
// );
router.post(
  "/register",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Invalid email format")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject("Email address already exists!");
          }
        });
      }),
    body("name")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Must be at least 5 chars long"),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Must be at least 5 chars long"),
    body("conf_password").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      } else {
        return value;
      }
    })
  ],
  authController.register
);
router.post(
  "/login",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Invalid email format"),
    body("password")
      .trim()
      .custom((value, { req }) => {
        // Check if login type is undefined (normal login method)
        if (typeof req.body.login_type === undefined) {
          if (value === "") {
            throw new Error("Incorrect email or password");
          }
          if (value.length < 5) {
            throw new Error("Must be at least 5 chars long");
          }
        }
      })
  ],
  authController.login
);

module.exports = router;

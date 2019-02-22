const express = require("express");
const { body } = require("express-validator/check");

const router = express.Router();

const authController = require("../controllers/auth.controller");

router.post(
  "/getToken",
  [
    body("email")
      .trim()
      .isEmail()
  ],
  authController.getToken
);
router.post(
  "/register",
  [
    body("email")
      .trim()
      .isEmail(),
    body("name")
      .trim()
      .isLength({ min: 5 })
  ],
  authController.register
);

module.exports = router;

const _ = require("lodash");
const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");

const User = require("../models/user.model");

exports.getToken = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorect");
    error.statusCode = 422;
    throw error;
  }

  const body = _.pick(req.body, ["email", "password"]);
  let loadedUser;

  User.findOne({ email: body.email })
    .then(user => {
      if (!user) {
        const error = new Error("A user with this email could not be found.");
        error.statusCode = 404;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(body.password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error("Wrong password");
        error.statusCode = 401;
        throw error;
      }
      const data = {
        name: loadedUser.name,
        email: loadedUser.email,
        token: loadedUser.tokens[0].token
      };
      res.status(200).json({ err_no: 0, message: "Success", data });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.register = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorect");
    error.statusCode = 422;
    throw error;
  }

  const body = _.pick(req.body, ["email", "name", "password"]);
  const user = new User();
  bcrypt
    .hash(body.password, 12)
    .then(hashedPassword => {
      user.email = body.email;
      user.name = body.name;
      user.password = hashedPassword;
      return user.save();
    })
    .then(result => {
      console.log("[authController][register] result", result);
      return user.generateAuthToken();
    })
    .then(token => {
      res
        .status(200)
        .json({ err_no: 0, message: "Register success", data: user });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

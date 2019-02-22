const _ = require('lodash');
const { validationResult } = require("express-validator/check");

const User = require("../models/user.model");

exports.getToken = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorect");
    error.statusCode = 422;
    throw error;
  }

  const body = _.pick(req.body, ['email']);

  User.findOne(body)
    .then(user => {
      if (!user) {
        const error = new Error("A user with this email could not be found.");
        error.statusCode = 404;
        throw error;
      }
      const data = {
        _id: user._id,
        name: user.name,
        token: user.tokens[0].token
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

  const body = _.pick(req.body, ['email', 'name']);

  const user = new User(body);
  user
    .save()
    .then(() => {
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

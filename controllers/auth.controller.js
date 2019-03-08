const _ = require("lodash");
const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");

const User = require("../models/user.model");

// exports.getToken = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new Error("Validation failed, entered data is incorect");
//     error.statusCode = 422;
//     throw error;
//   }

//   const body = _.pick(req.body, ["email", "password"]);
//   let loadedUser;

//   User.findOne({ email: body.email })
//     .then(user => {
//       if (_.isEmpty(user)) {
//         const error = new Error("A user with this email could not be found.");
//         error.statusCode = 404;
//         throw error;
//       }
//       loadedUser = user;
//       return bcrypt.compare(body.password, user.password);
//     })
//     .then(isEqual => {
//       if (!isEqual) {
//         const error = new Error("Wrong password");
//         error.statusCode = 401;
//         throw error;
//       }
//       const data = {
//         name: loadedUser.name,
//         email: loadedUser.email,
//         token: loadedUser.tokens[0].token
//       };
//       res.status(200).json({ err_no: 0, message: "Success", data });
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };

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

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }

  const loginType = req.body.login_type;

  switch (loginType) {
    case "normal":
      normalLogin(req, res, next);
      break;
    case "google":
      googleLogin(req, res, next);
      break;
    default:
      const error = new Error("Invalid access");
      error.statusCode = 500;
      throw error;
  }
};

const normalLogin = (req, res, next) => {
  const body = _.pick(req.body, ["email", "password"]);
  let loadedUser;

  User.findOne({ email: body.email })
    .then(user => {
      if (_.isEmpty(user)) {
        const error = new Error("A user with this email could not be found.");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(body.password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error("Wrong username or password");
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

const googleLogin = (req, res, next) => {
  const body = _.pick(req.body, ["name", "email", "token"]);

  User.findOne({ email: body.email })
    .then(user => {
      if (_.isEmpty(user)) {
        // Register new user into database
        const newUser = new User();
        newUser.email = body.email;
        newUser.name = body.name;
        newUser.tokens.push({ access: "google", token: body.token });
        return newUser.save();
      } else {
        // Update the user token
        return User.findOneAndUpdate(
          { _id: user._id, "tokens.access": "google" },
          { $set: { "tokens.$.token": body.token } },
          { new: true }
        );
      }
    })
    .then(result => {
      res.status(200).json({
        err_no: 0,
        message: "Success",
        data: {
          name: result.name,
          email: result.email,
          token: result.tokens[0].token
        }
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

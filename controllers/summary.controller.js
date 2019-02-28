const _ = require('lodash');
const { validationResult } = require('express-validator/check')

const CashFlow = require("../models/cash-flow.model");
const User = require("../models/user.model");

exports.getBalance = (req, res, next) => {
  User.findById(req.user._id, { _id: 0, balance: 1 })
    .then(result => {
      res.status(200).json({
        err_no: 0,
        message: "Get balance success",
        balance: result.balance
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.report = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }

  const endDate = req.query.end_date || new Date();

  CashFlow.aggregate([
    {
      $match: {
        user: req.user._id,
        date: {
          $gte: new Date(req.query.start_date),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: {
          month: { $month: "$date" },
          year: { $year: "$date" }
        },
        month: { $first: { $month: "$date" } },
        year: { $first: { $year: "$date" } },
        balance: { $sum: "$amount" }
      }
    },
    {
      $sort: { month: 1, year: 1 }
    },
    {
      $project: {
        _id: 0,
        month: 1,
        year: 1,
        balance: 1
      }
    }
  ])
    .then(result => {
      if (_.isEmpty(result)) {
        const error = new Error("Could not find data");
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        err_no: 0,
        message: "Fetch report success",
        data: result
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

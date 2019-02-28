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
  console.log("[report] query", req.query);

  CashFlow.aggregate([
    {
      $match: {
        user: req.user._id,
        date: {
          $gte: new Date(req.query.start_date),
          $lte: new Date(req.query.end_date)
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

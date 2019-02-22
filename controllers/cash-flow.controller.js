const _ = require("lodash");
const { validationResult } = require("express-validator/check");

const CashFlow = require("../models/cash-flow.model");

exports.getAll = (req, res, next) => {
  const page = req.query.page ? req.query.page : 1;
  const limit = req.query.limit ? req.query.limit : 10;

  const options = { page, limit, populate: { path: "user", select: "name" } };

  //   CashFlow.find({
  //     user: req.user._id
  //   })
  //     .populate("user", "name")
  CashFlow.paginate({ user: req.user._id }, options)
    .then(result => {
      res.status(200).json({
        err_no: 0,
        message: "Fetch data success",
        data: result.docs,
        total: result.totalDocs,
        page: result.page
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.create = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }

  const body = _.pick(req.body, ["type", "category", "amount", "description"]);
  const post = new CashFlow({ ...body, user: req.user._id });
  post
    .save()
    .then(result => {
      res.status(201).json({
        err_no: 0,
        message: "Cash flow created successfully",
        data: { id: result._id }
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getById = (req, res, next) => {
  const id = req.params.id;

  CashFlow.findById(id)
    .populate("user", "name")
    .then(result => {
      res.status(200).json({
        err_no: 0,
        message: "Fetch data success",
        data: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.delete = (req, res, next) => {
  const id = req.params.id;

  CashFlow.findByIdAndRemove(id)
    .then(result => {
      if (!result) {
        const error = new Error("Could not find data");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        err_no: 0,
        message: "Delete data success"
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

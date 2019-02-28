const { validationResult } = require("express-validator/check");

const Category = require("../models/category.model");

exports.getAll = (req, res, next) => {
  const page = req.query.page ? req.query.page : 1;
  const limit = req.query.limit ? req.query.limit : 10;

  const options = { page, limit };

  Category.paginate({}, options)
    .then(result => {
      res.status(200).json({
        err_no: 0,
        message: "Fetch category success",
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

exports.getById = (req, res, next) => {
  const id = req.params.id;

  Category.findById(id)
    .then(result => {
      res.status(200).json({
        err_no: 0,
        message: "Fetch category success",
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

  Category.findByIdAndRemove(id)
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

exports.create = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }

  const category = new Category({ category_name: req.body.category_name });
  category
    .save()
    .then(result => {
      res.status(201).json({
        err_no: 0,
        message: "Category created successfully",
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

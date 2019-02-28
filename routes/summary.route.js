const express = require("express");
const { query } = require("express-validator/check");
const _ = require("lodash");

const router = express.Router();

const summaryController = require("../controllers/summary.controller");

const { authenticate } = require("../middleware/authenticate");

router.get("/getBalance", authenticate, summaryController.getBalance);
router.get(
  "/report",
  authenticate,
  [
    query("start_date").custom((value, { req }) => {
      if (_.isUndefined(value)) {
        throw new Error("Start date is required");
      } else {
        const startDate = new Date(value);
        const endDate = _.isUndefined(req.query.end_date)
          ? new Date()
          : req.query.end_date;
        if (startDate > endDate) {
          throw new Error("Start date cannot be greater than end date");
        } else {
          return value;
        }
      }
    })
  ],
  summaryController.report
);

module.exports = router;

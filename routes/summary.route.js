const express = require("express");

const router = express.Router();

const summaryController = require("../controllers/summary.controller");

const { authenticate } = require("../middleware/authenticate");

router.get("/getBalance", authenticate, summaryController.getBalance);
router.get("/report", authenticate, summaryController.report);

module.exports = router;

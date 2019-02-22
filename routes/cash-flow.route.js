const express = require("express");
const { body } = require("express-validator/check");

const router = express.Router();

const cashFlowController = require("../controllers/cash-flow.controller");

const { authenticate } = require("../middleware/authenticate");

router.get("/", authenticate, cashFlowController.getAll);
router.post(
  "/",
  authenticate,
  [
    body("type").trim(),
    body("category").trim(),
    body("amount")
      .trim()
      .isNumeric(),
    body("description").trim()
  ],
  cashFlowController.create
);
router.get("/:id", authenticate, cashFlowController.getById);
router.delete("/:id", authenticate, cashFlowController.delete);

module.exports = router;

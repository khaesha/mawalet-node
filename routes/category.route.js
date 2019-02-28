const express = require("express");
const { body } = require("express-validator/check");

const router = express.Router();

const categoryController = require("../controllers/category.controller");

const { authenticate } = require("../middleware/authenticate");

router.get("/", authenticate, categoryController.getAll);
router.get("/:id", authenticate, categoryController.getById);
router.delete("/:id", authenticate, categoryController.delete);
router.post(
  "/",
  authenticate,
  [body("category_name").trim()],
  categoryController.create
);

module.exports = router;

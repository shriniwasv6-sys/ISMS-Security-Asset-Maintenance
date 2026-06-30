const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const assetCategoriesController = require("../controllers/assetCategoriesController");

router.get("/", authenticate, assetCategoriesController.getAllCategories);
router.get("/:id", authenticate, assetCategoriesController.getCategoryById);
router.post("/", authenticate, authorize("Admin", "Manager"), assetCategoriesController.createCategory);
router.put("/:id", authenticate, authorize("Admin", "Manager"), assetCategoriesController.updateCategory);
router.delete("/:id", authenticate, authorize("Admin"), assetCategoriesController.deleteCategory);

module.exports = router;
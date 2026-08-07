const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const assetCategoriesController = require(
    "../controllers/assetCategoriesController"
);

/**
 * @swagger
 * /api/asset-categories:
 *   get:
 *     summary: Get all asset categories
 *     tags:
 *       - Asset Categories
 *     responses:
 *       200:
 *         description: List of asset categories
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/",
    authenticate,
    assetCategoriesController.getAllCategories
);

/**
 * @swagger
 * /api/asset-categories/{id}:
 *   get:
 *     summary: Get asset category by ID
 *     tags:
 *       - Asset Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Asset category found
 *       404:
 *         description: Asset category not found
 */
router.get(
    "/:id",
    authenticate,
    assetCategoriesController.getCategoryById
);

/**
 * @swagger
 * /api/asset-categories:
 *   post:
 *     summary: Create an asset category
 *     tags:
 *       - Asset Categories
 *     responses:
 *       201:
 *         description: Asset category created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
    "/",
    authenticate,
    authorize("Admin", "Manager"),
    assetCategoriesController.createCategory
);

/**
 * @swagger
 * /api/asset-categories/{id}:
 *   put:
 *     summary: Update an asset category
 *     tags:
 *       - Asset Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Asset category updated successfully
 *       404:
 *         description: Asset category not found
 */
router.put(
    "/:id",
    authenticate,
    authorize("Admin", "Manager"),
    assetCategoriesController.updateCategory
);

/**
 * @swagger
 * /api/asset-categories/{id}:
 *   delete:
 *     summary: Delete an asset category
 *     tags:
 *       - Asset Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Asset category deleted successfully
 *       404:
 *         description: Asset category not found
 */
router.delete(
    "/:id",
    authenticate,
    authorize("Admin"),
    assetCategoriesController.deleteCategory
);

module.exports = router;
const express = require("express");

const assetsController = require(
    "../controllers/assetsController"
);

const router = express.Router();

/**
 * @swagger
 * /api/assets:
 *   get:
 *     summary: Get all assets
 *     tags:
 *       - Assets
 *     responses:
 *       200:
 *         description: List of assets
 */
router.get(
    "/",
    assetsController.getAllAssets
);

router.get(
    "/:id",
    assetsController.getAssetById
);

router.post(
    "/",
    assetsController.createAsset
);

router.put(
    "/:id",
    assetsController.updateAsset
);

router.delete(
    "/:id",
    assetsController.deleteAsset
);

module.exports = router;
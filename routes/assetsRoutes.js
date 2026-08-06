const express = require("express");

const assetsController = require(
    "../controllers/assetsController"
);

const router = express.Router();

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
const assetsService = require(
    "../services/assetsService"
);

/**
 * GET /api/assets
 */
async function getAllAssets(req, res) {
    try {
        const assets =
            await assetsService.getAllAssets();

        return res.status(200).json(assets);
    } catch (error) {
        console.error(
            "Get all assets error:",
            error
        );

        return res.status(500).json({
            message:
                "Unable to retrieve assets.",
            error: error.message
        });
    }
}

/**
 * GET /api/assets/:id
 */
async function getAssetById(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message:
                    "Invalid asset ID."
            });
        }

        const asset =
            await assetsService.getAssetById(id);

        if (!asset) {
            return res.status(404).json({
                message:
                    "Asset not found."
            });
        }

        return res.status(200).json(asset);
    } catch (error) {
        console.error(
            "Get asset error:",
            error
        );

        return res.status(500).json({
            message:
                "Unable to retrieve the asset.",
            error: error.message
        });
    }
}

/**
 * POST /api/assets
 */
async function createAsset(req, res) {
    try {
        const validationError =
            validateAsset(req.body);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const tagExists =
            await assetsService.assetTagExists(
                req.body.assetTag.trim()
            );

        if (tagExists) {
            return res.status(409).json({
                message:
                    "Asset tag already exists."
            });
        }

        const newAsset =
            await assetsService.createAsset({
                assetName:
                    req.body.assetName.trim(),

                assetTag:
                    req.body.assetTag.trim(),

                categoryId:
                    Number(req.body.categoryId),

                siteId:
                    Number(req.body.siteId),

                vendorId:
                    Number(req.body.vendorId),

                installationDate:
                    req.body.installationDate ||
                    null,

                warrantyExpiry:
                    req.body.warrantyExpiry ||
                    null,

                status:
                    req.body.status ||
                    "Active"
            });

        return res.status(201).json(
            newAsset
        );
    } catch (error) {
        console.error(
            "Create asset error:",
            error
        );

        return res.status(500).json({
            message:
                "Unable to create the asset.",
            error: error.message
        });
    }
}

/**
 * PUT /api/assets/:id
 */
async function updateAsset(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message:
                    "Invalid asset ID."
            });
        }

        const validationError =
            validateAsset(req.body);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const existingAsset =
            await assetsService.getAssetById(id);

        if (!existingAsset) {
            return res.status(404).json({
                message:
                    "Asset not found."
            });
        }

        const tagExists =
            await assetsService.assetTagExists(
                req.body.assetTag.trim(),
                id
            );

        if (tagExists) {
            return res.status(409).json({
                message:
                    "Asset tag already exists."
            });
        }

        const updatedAsset =
            await assetsService.updateAsset(
                id,
                {
                    assetName:
                        req.body.assetName.trim(),

                    assetTag:
                        req.body.assetTag.trim(),

                    categoryId:
                        Number(
                            req.body.categoryId
                        ),

                    siteId:
                        Number(req.body.siteId),

                    vendorId:
                        Number(req.body.vendorId),

                    installationDate:
                        req.body.installationDate ||
                        null,

                    warrantyExpiry:
                        req.body.warrantyExpiry ||
                        null,

                    status:
                        req.body.status ||
                        "Active"
                }
            );

        return res.status(200).json(
            updatedAsset
        );
    } catch (error) {
        console.error(
            "Update asset error:",
            error
        );

        return res.status(500).json({
            message:
                "Unable to update the asset.",
            error: error.message
        });
    }
}

/**
 * DELETE /api/assets/:id
 */
async function deleteAsset(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message:
                    "Invalid asset ID."
            });
        }

        const existingAsset =
            await assetsService.getAssetById(id);

        if (!existingAsset) {
            return res.status(404).json({
                message:
                    "Asset not found."
            });
        }

        const deletedRows =
            await assetsService.deleteAsset(id);

        if (deletedRows === 0) {
            return res.status(404).json({
                message:
                    "Asset not found."
            });
        }

        return res.status(200).json({
            message:
                "Asset deleted successfully."
        });
    } catch (error) {
        console.error(
            "Delete asset error:",
            error
        );

        return res.status(500).json({
            message:
                "Unable to delete the asset.",
            error: error.message
        });
    }
}

/**
 * Validate required asset fields.
 */
function validateAsset(asset) {
    if (
        !asset.assetName ||
        !String(asset.assetName).trim()
    ) {
        return "Asset name is required.";
    }

    if (
        !asset.assetTag ||
        !String(asset.assetTag).trim()
    ) {
        return "Asset tag is required.";
    }

    const categoryId =
        Number(asset.categoryId);

    const siteId =
        Number(asset.siteId);

    const vendorId =
        Number(asset.vendorId);

    if (
        !Number.isInteger(categoryId) ||
        categoryId <= 0
    ) {
        return "A valid category is required.";
    }

    if (
        !Number.isInteger(siteId) ||
        siteId <= 0
    ) {
        return "A valid site is required.";
    }

    if (
        !Number.isInteger(vendorId) ||
        vendorId <= 0
    ) {
        return "A valid vendor is required.";
    }

    const allowedStatuses = [
        "Active",
        "Inactive",
        "Under Maintenance",
        "Retired"
    ];

    if (
        asset.status &&
        !allowedStatuses.includes(
            asset.status
        )
    ) {
        return "Invalid asset status.";
    }

    if (
        asset.installationDate &&
        asset.warrantyExpiry &&
        new Date(asset.warrantyExpiry) <
            new Date(asset.installationDate)
    ) {
        return (
            "Warranty expiry cannot be before " +
            "the installation date."
        );
    }

    return null;
}

module.exports = {
    getAllAssets,
    getAssetById,
    createAsset,
    updateAsset,
    deleteAsset
};
const sql = require("mssql");
const { poolPromise } = require("../config/db");

/**
 * Get all assets with related category, site,
 * and vendor names.
 */
async function getAllAssets() {
    const pool = await poolPromise;

    const result = await pool.request().query(`
        SELECT
            a.AssetId,
            a.AssetName,
            a.AssetTag,
            a.CategoryId,
            c.CategoryName,
            a.SiteId,
            s.SiteName,
            a.VendorId,
            v.VendorName,
            a.InstallationDate,
            a.WarrantyExpiry,
            a.Status
        FROM dbo.Assets a
        INNER JOIN dbo.AssetCategories c
            ON a.CategoryId = c.CategoryId
        INNER JOIN dbo.Sites s
            ON a.SiteId = s.SiteId
        INNER JOIN dbo.Vendors v
            ON a.VendorId = v.VendorId
        ORDER BY a.AssetId;
    `);

    return result.recordset;
}

/**
 * Get one asset by ID.
 */
async function getAssetById(id) {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("id", sql.Int, id)
        .query(`
            SELECT
                a.AssetId,
                a.AssetName,
                a.AssetTag,
                a.CategoryId,
                c.CategoryName,
                a.SiteId,
                s.SiteName,
                a.VendorId,
                v.VendorName,
                a.InstallationDate,
                a.WarrantyExpiry,
                a.Status
            FROM dbo.Assets a
            INNER JOIN dbo.AssetCategories c
                ON a.CategoryId = c.CategoryId
            INNER JOIN dbo.Sites s
                ON a.SiteId = s.SiteId
            INNER JOIN dbo.Vendors v
                ON a.VendorId = v.VendorId
            WHERE a.AssetId = @id;
        `);

    return result.recordset[0] || null;
}

/**
 * Check whether an asset tag already exists.
 */
async function assetTagExists(assetTag, excludedAssetId = null) {
    const pool = await poolPromise;

    const request = pool
        .request()
        .input(
            "assetTag",
            sql.VarChar(50),
            assetTag
        );

    let query = `
        SELECT AssetId
        FROM dbo.Assets
        WHERE AssetTag = @assetTag
    `;

    if (excludedAssetId !== null) {
        request.input(
            "excludedAssetId",
            sql.Int,
            excludedAssetId
        );

        query += `
            AND AssetId <> @excludedAssetId
        `;
    }

    const result = await request.query(query);

    return result.recordset.length > 0;
}

/**
 * Create an asset.
 */
async function createAsset(asset) {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input(
            "assetName",
            sql.VarChar(100),
            asset.assetName
        )
        .input(
            "assetTag",
            sql.VarChar(50),
            asset.assetTag
        )
        .input(
            "categoryId",
            sql.Int,
            asset.categoryId
        )
        .input(
            "siteId",
            sql.Int,
            asset.siteId
        )
        .input(
            "vendorId",
            sql.Int,
            asset.vendorId
        )
        .input(
            "installationDate",
            sql.Date,
            asset.installationDate || null
        )
        .input(
            "warrantyExpiry",
            sql.Date,
            asset.warrantyExpiry || null
        )
        .input(
            "status",
            sql.VarChar(30),
            asset.status || "Active"
        )
        .query(`
            INSERT INTO dbo.Assets
            (
                AssetName,
                AssetTag,
                CategoryId,
                SiteId,
                VendorId,
                InstallationDate,
                WarrantyExpiry,
                Status
            )
            VALUES
            (
                @assetName,
                @assetTag,
                @categoryId,
                @siteId,
                @vendorId,
                @installationDate,
                @warrantyExpiry,
                @status
            );

            SELECT
                CAST(SCOPE_IDENTITY() AS INT)
                AS AssetId;
        `);

    const newAssetId =
        result.recordset[0].AssetId;

    return getAssetById(newAssetId);
}

/**
 * Update an asset.
 */
async function updateAsset(id, asset) {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("id", sql.Int, id)
        .input(
            "assetName",
            sql.VarChar(100),
            asset.assetName
        )
        .input(
            "assetTag",
            sql.VarChar(50),
            asset.assetTag
        )
        .input(
            "categoryId",
            sql.Int,
            asset.categoryId
        )
        .input(
            "siteId",
            sql.Int,
            asset.siteId
        )
        .input(
            "vendorId",
            sql.Int,
            asset.vendorId
        )
        .input(
            "installationDate",
            sql.Date,
            asset.installationDate || null
        )
        .input(
            "warrantyExpiry",
            sql.Date,
            asset.warrantyExpiry || null
        )
        .input(
            "status",
            sql.VarChar(30),
            asset.status || "Active"
        )
        .query(`
            UPDATE dbo.Assets
            SET
                AssetName = @assetName,
                AssetTag = @assetTag,
                CategoryId = @categoryId,
                SiteId = @siteId,
                VendorId = @vendorId,
                InstallationDate = @installationDate,
                WarrantyExpiry = @warrantyExpiry,
                Status = @status
            WHERE AssetId = @id;
        `);

    if (result.rowsAffected[0] === 0) {
        return null;
    }

    return getAssetById(id);
}

/**
 * Delete an asset.
 */
async function deleteAsset(id) {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("id", sql.Int, id)
        .query(`
            DELETE FROM dbo.Assets
            WHERE AssetId = @id;
        `);

    return result.rowsAffected[0];
}

module.exports = {
    getAllAssets,
    getAssetById,
    assetTagExists,
    createAsset,
    updateAsset,
    deleteAsset
};
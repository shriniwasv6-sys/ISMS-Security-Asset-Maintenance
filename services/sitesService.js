const sql = require("mssql");
const { poolPromise } = require("../config/db");

async function getAllSites() {
    const pool = await poolPromise;

    const result = await pool.request().query(`
        SELECT
            SiteId,
            SiteName,
            Address,
            ContactPerson,
            ContactNumber,
            CreatedAt
        FROM dbo.Sites
        ORDER BY SiteId
    `);

    return result.recordset;
}

async function getSiteById(id) {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("id", sql.Int, id)
        .query(`
            SELECT
                SiteId,
                SiteName,
                Address,
                ContactPerson,
                ContactNumber,
                CreatedAt
            FROM dbo.Sites
            WHERE SiteId = @id
        `);

    return result.recordset[0] || null;
}

async function createSite(site) {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input(
            "siteName",
            sql.NVarChar(150),
            site.siteName
        )
        .input(
            "address",
            sql.NVarChar(250),
            site.address
        )
        .input(
            "contactPerson",
            sql.NVarChar(150),
            site.contactPerson || null
        )
        .input(
            "contactNumber",
            sql.NVarChar(30),
            site.contactNumber || null
        )
        .query(`
            INSERT INTO dbo.Sites
            (
                SiteName,
                Address,
                ContactPerson,
                ContactNumber
            )
            VALUES
            (
                @siteName,
                @address,
                @contactPerson,
                @contactNumber
            );

            SELECT
                CAST(SCOPE_IDENTITY() AS INT)
                AS SiteId;
        `);

    const newSiteId =
        result.recordset[0].SiteId;

    return getSiteById(newSiteId);
}

async function updateSite(id, site) {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("id", sql.Int, id)
        .input(
            "siteName",
            sql.NVarChar(150),
            site.siteName
        )
        .input(
            "address",
            sql.NVarChar(250),
            site.address
        )
        .input(
            "contactPerson",
            sql.NVarChar(150),
            site.contactPerson || null
        )
        .input(
            "contactNumber",
            sql.NVarChar(30),
            site.contactNumber || null
        )
        .query(`
            UPDATE dbo.Sites
            SET
                SiteName = @siteName,
                Address = @address,
                ContactPerson = @contactPerson,
                ContactNumber = @contactNumber
            WHERE SiteId = @id
        `);

    if (result.rowsAffected[0] === 0) {
        return null;
    }

    return getSiteById(id);
}

async function deleteSite(id) {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("id", sql.Int, id)
        .query(`
            DELETE FROM dbo.Sites
            WHERE SiteId = @id
        `);

    return result.rowsAffected[0];
}

module.exports = {
    getAllSites,
    getSiteById,
    createSite,
    updateSite,
    deleteSite
};
const { poolPromise } = require("../config/db");

// Get all sites
async function getAllSites() {
    const pool = await poolPromise;

    const result = await pool.request().query(`
        SELECT *
        FROM Sites
        ORDER BY SiteId
    `);

    return result.recordset;
}

// Get site by ID
async function getSiteById(id) {
    const pool = await poolPromise;

    const result = await pool.request()
        .input("id", id)
        .query(`
            SELECT *
            FROM Sites
            WHERE SiteId = @id
        `);

    return result.recordset[0];
}

// Create site
async function createSite(site) {
    const pool = await poolPromise;

    const result = await pool.request()
        .input("siteName", site.siteName)
        .input("address", site.address)
        .query(`
            INSERT INTO Sites
            (
                SiteName,
                Address
            )

            VALUES
            (
                @siteName,
                @address
            );

            SELECT SCOPE_IDENTITY() AS SiteId;
        `);

    return result.recordset[0];
}

// Update site
async function updateSite(id, site) {

    const pool = await poolPromise;

    await pool.request()
        .input("id", id)
        .input("siteName", site.siteName)
        .input("address", site.address)
        .query(`
            UPDATE Sites

            SET

                SiteName=@siteName,

                Address=@address

            WHERE SiteId=@id
        `);

    return getSiteById(id);

}

// Delete site
async function deleteSite(id) {

    const pool = await poolPromise;

    const result = await pool.request()
        .input("id", id)
        .query(`
            DELETE FROM Sites

            WHERE SiteId=@id
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
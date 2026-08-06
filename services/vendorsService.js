const sql = require("mssql");
const { poolPromise } = require("../config/db");

/**
 * Get all vendors.
 */
async function getAllVendors() {
    const pool = await poolPromise;

    const result = await pool.request().query(`
        SELECT
            VendorId,
            VendorName,
            ContactPerson,
            Phone,
            Email,
            CreatedAt
        FROM dbo.Vendors
        ORDER BY VendorId
    `);

    return result.recordset;
}

/**
 * Get one vendor by ID.
 */
async function getVendorById(id) {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("id", sql.Int, id)
        .query(`
            SELECT
                VendorId,
                VendorName,
                ContactPerson,
                Phone,
                Email,
                CreatedAt
            FROM dbo.Vendors
            WHERE VendorId = @id
        `);

    return result.recordset[0] || null;
}

/**
 * Create a vendor.
 */
async function createVendor(vendor) {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input(
            "vendorName",
            sql.VarChar(150),
            vendor.vendorName
        )
        .input(
            "contactPerson",
            sql.VarChar(100),
            vendor.contactPerson || null
        )
        .input(
            "phone",
            sql.VarChar(20),
            vendor.phone || null
        )
        .input(
            "email",
            sql.VarChar(100),
            vendor.email || null
        )
        .query(`
            INSERT INTO dbo.Vendors
            (
                VendorName,
                ContactPerson,
                Phone,
                Email
            )
            VALUES
            (
                @vendorName,
                @contactPerson,
                @phone,
                @email
            );

            SELECT
                CAST(SCOPE_IDENTITY() AS INT)
                AS VendorId;
        `);

    const newVendorId =
        result.recordset[0].VendorId;

    return getVendorById(newVendorId);
}

/**
 * Update a vendor.
 */
async function updateVendor(id, vendor) {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("id", sql.Int, id)
        .input(
            "vendorName",
            sql.VarChar(150),
            vendor.vendorName
        )
        .input(
            "contactPerson",
            sql.VarChar(100),
            vendor.contactPerson || null
        )
        .input(
            "phone",
            sql.VarChar(20),
            vendor.phone || null
        )
        .input(
            "email",
            sql.VarChar(100),
            vendor.email || null
        )
        .query(`
            UPDATE dbo.Vendors
            SET
                VendorName = @vendorName,
                ContactPerson = @contactPerson,
                Phone = @phone,
                Email = @email
            WHERE VendorId = @id
        `);

    if (result.rowsAffected[0] === 0) {
        return null;
    }

    return getVendorById(id);
}

/**
 * Delete a vendor.
 */
async function deleteVendor(id) {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("id", sql.Int, id)
        .query(`
            DELETE FROM dbo.Vendors
            WHERE VendorId = @id
        `);

    return result.rowsAffected[0];
}

module.exports = {
    getAllVendors,
    getVendorById,
    createVendor,
    updateVendor,
    deleteVendor
};
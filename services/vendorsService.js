const { poolPromise } = require("../config/db");

async function getAllVendors() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
        SELECT *
        FROM Vendors
        ORDER BY VendorId
    `);
    return result.recordset;
}

async function getVendorById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("id", id)
        .query(`
            SELECT *
            FROM Vendors
            WHERE VendorId = @id
        `);
    return result.recordset[0];
}

async function createVendor(vendor) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("vendorName", vendor.vendorName)
        .input("contactPerson", vendor.contactPerson)
        .input("phone", vendor.phone)
        .input("email", vendor.email)
        .query(`
            INSERT INTO Vendors (VendorName, ContactPerson, Phone, Email)
            VALUES (@vendorName, @contactPerson, @phone, @email);

            SELECT SCOPE_IDENTITY() AS VendorId;
        `);
    return result.recordset[0];
}

async function updateVendor(id, vendor) {
    const pool = await poolPromise;

    await pool.request()
        .input("id", id)
        .input("vendorName", vendor.vendorName)
        .input("contactPerson", vendor.contactPerson)
        .input("phone", vendor.phone)
        .input("email", vendor.email)
        .query(`
            UPDATE Vendors
            SET VendorName = @vendorName,
                ContactPerson = @contactPerson,
                Phone = @phone,
                Email = @email
            WHERE VendorId = @id
        `);

    return getVendorById(id);
}

async function deleteVendor(id) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("id", id)
        .query(`
            DELETE FROM Vendors
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
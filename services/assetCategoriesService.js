const { poolPromise } = require("../config/db");

async function getAllCategories() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
        SELECT *
        FROM AssetCategories
        ORDER BY CategoryId
    `);
    return result.recordset;
}

async function getCategoryById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("id", id)
        .query(`
            SELECT *
            FROM AssetCategories
            WHERE CategoryId = @id
        `);
    return result.recordset[0];
}

async function createCategory(category) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("categoryName", category.categoryName)
        .input("description", category.description)
        .query(`
            INSERT INTO AssetCategories (CategoryName, Description)
            VALUES (@categoryName, @description);

            SELECT SCOPE_IDENTITY() AS CategoryId;
        `);
    return result.recordset[0];
}

async function updateCategory(id, category) {
    const pool = await poolPromise;

    await pool.request()
        .input("id", id)
        .input("categoryName", category.categoryName)
        .input("description", category.description)
        .query(`
            UPDATE AssetCategories
            SET CategoryName = @categoryName,
                Description = @description
            WHERE CategoryId = @id
        `);

    return getCategoryById(id);
}

async function deleteCategory(id) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("id", id)
        .query(`
            DELETE FROM AssetCategories
            WHERE CategoryId = @id
        `);

    return result.rowsAffected[0];
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
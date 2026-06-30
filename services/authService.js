const { poolPromise } = require("../config/db");

async function getUserByEmail(email) {
    const pool = await poolPromise;

    const result = await pool.request()
        .input("email", email)
        .query(`
            SELECT
                u.UserId,
                u.FullName,
                u.Email,
                u.PasswordHash,
                r.RoleName
            FROM Users u
            INNER JOIN Roles r
                ON u.RoleId = r.RoleId
            WHERE u.Email=@email
        `);

    return result.recordset[0];
}

module.exports = {
    getUserByEmail
};
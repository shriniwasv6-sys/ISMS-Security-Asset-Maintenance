const bcrypt = require("bcryptjs");
const { poolPromise } = require("../config/db");

async function getAllUsers() {
    const pool = await poolPromise;

    const result = await pool.request().query(`
        SELECT u.UserId, u.FullName, u.Email, u.Phone, r.RoleName
        FROM Users u
        INNER JOIN Roles r ON u.RoleId = r.RoleId
        ORDER BY u.UserId
    `);

    return result.recordset;
}

async function getUserById(id) {
    const pool = await poolPromise;

    const result = await pool.request()
        .input("id", id)
        .query(`
            SELECT u.UserId, u.FullName, u.Email, u.Phone, r.RoleName
            FROM Users u
            INNER JOIN Roles r ON u.RoleId = r.RoleId
            WHERE u.UserId = @id
        `);

    return result.recordset[0];
}

async function createUser(user) {
    const pool = await poolPromise;
    const passwordHash = await bcrypt.hash(user.password, 10);

    const result = await pool.request()
        .input("fullName", user.fullName)
        .input("email", user.email)
        .input("passwordHash", passwordHash)
        .input("phone", user.phone)
        .input("roleId", user.roleId)
        .query(`
            INSERT INTO Users (FullName, Email, PasswordHash, Phone, RoleId)
            VALUES (@fullName, @email, @passwordHash, @phone, @roleId);

            SELECT SCOPE_IDENTITY() AS UserId;
        `);

    return result.recordset[0];
}

async function updateUser(id, user) {
    const pool = await poolPromise;

    await pool.request()
        .input("id", id)
        .input("fullName", user.fullName)
        .input("email", user.email)
        .input("phone", user.phone)
        .input("roleId", user.roleId)
        .query(`
            UPDATE Users
            SET FullName = @fullName,
                Email = @email,
                Phone = @phone,
                RoleId = @roleId
            WHERE UserId = @id
        `);

    return getUserById(id);
}

async function deleteUser(id) {
    const pool = await poolPromise;

    const result = await pool.request()
        .input("id", id)
        .query(`
            DELETE FROM Users
            WHERE UserId = @id
        `);

    return result.rowsAffected[0];
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
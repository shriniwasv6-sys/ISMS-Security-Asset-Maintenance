require("dotenv").config();

const bcrypt = require("bcrypt");
const sql = require("mssql");
const { poolPromise } = require("./config/db");

async function resetAdminPassword() {
    const email = "sharma@isimms.com";
    const newPassword = "Password123!";

    try {
        const passwordHash = await bcrypt.hash(
            newPassword,
            10
        );

        const pool = await poolPromise;

        const result = await pool
            .request()
            .input(
                "email",
                sql.VarChar(150),
                email
            )
            .input(
                "passwordHash",
                sql.VarChar(255),
                passwordHash
            )
            .query(`
                UPDATE dbo.Users
                SET PasswordHash = @passwordHash
                WHERE Email = @email
            `);

        if (result.rowsAffected[0] === 0) {
            console.log("User not found.");
            return;
        }

        console.log("Password reset successfully.");
        console.log("Email:", email);
        console.log("New password:", newPassword);
    } catch (error) {
        console.error(
            "Password reset failed:",
            error
        );
    } finally {
        await sql.close();
    }
}

resetAdminPassword();
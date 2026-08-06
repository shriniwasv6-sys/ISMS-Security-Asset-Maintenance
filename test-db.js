const { poolPromise } = require("./config/db");

async function testConnection() {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT GETDATE() AS CurrentDateTime");
        console.log(result.recordset);
        process.exit(0);
    } catch (error) {
        console.error("SQL Server test failed:", error.message);
        process.exit(1);
    }
}

testConnection();
const sql = require("mssql");
require("dotenv").config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,

    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const pool = new sql.ConnectionPool(config);

const poolPromise = pool
    .connect()
    .then((connectedPool) => {
        console.log("Connected to SQL Server");
        return connectedPool;
    })
    .catch((error) => {
        console.error(
            "Database connection failed:",
            error
        );

        throw error;
    });

async function closePool() {
    try {
        if (pool.connected) {
            await pool.close();
        }
    } catch (error) {
        console.error(
            "Unable to close database pool:",
            error
        );
    }
}

module.exports = {
    sql,
    pool,
    poolPromise,
    closePool
};
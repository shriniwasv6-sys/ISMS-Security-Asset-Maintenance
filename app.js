const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/usersRoutes");
const sitesRoutes = require("./routes/sitesRoutes");
const vendorsRoutes = require("./routes/vendorsRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.json({
        message: "Integrated Security Management System API"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/sites", sitesRoutes);
app.use("/api/vendors", vendorsRoutes);


const { poolPromise } = require("./config/db");

app.get("/api/v1/health", async (req, res) => {
    try {
        const pool = await poolPromise;

        await pool.request().query("SELECT 1");

        res.json({
            success: true,
            status: "OK",
            application: "Integrated Security Management System",
            version: "1.0.0",
            database: "Connected",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            status: "ERROR",
            application: "Integrated Security Management System",
            database: "Disconnected",
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = app;
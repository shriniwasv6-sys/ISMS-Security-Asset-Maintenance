const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/usersRoutes");
const sitesRoutes = require("./routes/sitesRoutes");
const vendorsRoutes = require("./routes/vendorsRoutes");
const assetCategoriesRoutes = require("./routes/assetCategoriesRoutes");
const assetsRoutes = require("./routes/assetsRoutes");
const maintenanceRequestsRoutes = require("./routes/maintenanceRequestsRoutes");

const { poolPromise } = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/api/assets", assetsRoutes);
app.use("/api/maintenance-requests",maintenanceRequestsRoutes);

/*
 * Open login.html when visiting:
 * http://localhost:3000
 */
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "login.html")
    );
});

/*
 * Serve CSS, JavaScript, images and HTML files.
 * index: false prevents an empty index.html from overriding login.html.
 */
app.use(
    express.static(
        path.join(__dirname, "public"),
        { index: false }
    )
);

/*
 * API routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/sites", sitesRoutes);
app.use("/api/vendors", vendorsRoutes);
app.use(
    "/api/asset-categories",
    assetCategoriesRoutes
);

/*
 * Health-check endpoint
 */
app.get("/api/v1/health", async (req, res) => {
    try {
        const pool = await poolPromise;

        await pool.request().query("SELECT 1");

        return res.status(200).json({
            success: true,
            status: "OK",
            application:
                "Integrated Security Management System",
            version: "1.0.0",
            database: "Connected",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Health-check error:", error);

        return res.status(500).json({
            success: false,
            status: "ERROR",
            application:
                "Integrated Security Management System",
            database: "Disconnected",
            message:
                "Unable to connect to the database.",
            timestamp: new Date().toISOString()
        });
    }
});

/*
 * API route-not-found handler
 */
app.use("/api", (req, res) => {
    return res.status(404).json({
        success: false,
        message: "API route not found"
    });
});

/*
 * General error handler
 */
app.use((error, req, res, next) => {
    console.error("Unhandled error:", error);

    return res.status(error.status || 500).json({
        success: false,
        message:
            error.message ||
            "Internal server error"
    });
});

module.exports = app;
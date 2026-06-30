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
module.exports = app;
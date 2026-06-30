const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const sitesController = require("../controllers/sitesController");

router.get(
    "/",
    authenticate,
    sitesController.getAllSites
);

router.get(
    "/:id",
    authenticate,
    sitesController.getSiteById
);

router.post(
    "/",
    authenticate,
    authorize("Admin","Manager"),
    sitesController.createSite
);

router.put(
    "/:id",
    authenticate,
    authorize("Admin","Manager"),
    sitesController.updateSite
);

router.delete(
    "/:id",
    authenticate,
    authorize("Admin"),
    sitesController.deleteSite
);

module.exports = router;
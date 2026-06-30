const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const vendorsController = require("../controllers/vendorsController");

router.get("/", authenticate, vendorsController.getAllVendors);
router.get("/:id", authenticate, vendorsController.getVendorById);
router.post("/", authenticate, authorize("Admin", "Manager"), vendorsController.createVendor);
router.put("/:id", authenticate, authorize("Admin", "Manager"), vendorsController.updateVendor);
router.delete("/:id", authenticate, authorize("Admin"), vendorsController.deleteVendor);

module.exports = router;
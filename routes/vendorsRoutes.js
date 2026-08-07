const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const vendorsController = require("../controllers/vendorsController");

/**
 * @swagger
 * /api/vendors:
 *   get:
 *     summary: Get all vendors
 *     tags:
 *       - Vendors
 *     responses:
 *       200:
 *         description: List of vendors
 */
router.get("/", vendorsController.getAllVendors);

router.get("/", authenticate, vendorsController.getAllVendors);
router.get("/:id", authenticate, vendorsController.getVendorById);
router.post("/", authenticate, authorize("Admin", "Manager"), vendorsController.createVendor);
router.put("/:id", authenticate, authorize("Admin", "Manager"), vendorsController.updateVendor);
router.delete("/:id", authenticate, authorize("Admin"), vendorsController.deleteVendor);

module.exports = router;
const express = require("express");

const maintenanceRequestsController =
    require(
        "../controllers/maintenanceRequestsController"
    );

const router = express.Router();

/**
 * @swagger
 * /api/maintenance-requests:
 *   get:
 *     summary: Get all maintenance requests
 *     tags:
 *       - Maintenance Requests
 *     responses:
 *       200:
 *         description: List of maintenance requests
 */
router.get(
    "/",
    maintenanceRequestsController
        .getAllMaintenanceRequests
);

router.get(
    "/:id",
    maintenanceRequestsController
        .getMaintenanceRequestById
);

router.post(
    "/",
    maintenanceRequestsController
        .createMaintenanceRequest
);

router.put(
    "/:id",
    maintenanceRequestsController
        .updateMaintenanceRequest
);

router.delete(
    "/:id",
    maintenanceRequestsController
        .deleteMaintenanceRequest
);

module.exports = router;
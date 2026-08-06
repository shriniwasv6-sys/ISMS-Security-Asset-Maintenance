const express = require("express");

const maintenanceRequestsController =
    require(
        "../controllers/maintenanceRequestsController"
    );

const router = express.Router();

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
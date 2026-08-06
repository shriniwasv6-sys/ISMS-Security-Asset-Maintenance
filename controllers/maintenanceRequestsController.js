const maintenanceRequestsService =
    require(
        "../services/maintenanceRequestsService"
    );

/**
 * GET /api/maintenance-requests
 */
async function getAllMaintenanceRequests(
    req,
    res
) {
    try {
        const requests =
            await maintenanceRequestsService
                .getAllMaintenanceRequests();

        return res.status(200).json(requests);
    } catch (error) {
        console.error(
            "Get maintenance requests error:",
            error
        );

        return res.status(500).json({
            message:
                "Unable to retrieve maintenance requests.",
            error: error.message
        });
    }
}

/**
 * GET /api/maintenance-requests/:id
 */
async function getMaintenanceRequestById(
    req,
    res
) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message:
                    "Invalid maintenance request ID."
            });
        }

        const maintenanceRequest =
            await maintenanceRequestsService
                .getMaintenanceRequestById(id);

        if (!maintenanceRequest) {
            return res.status(404).json({
                message:
                    "Maintenance request not found."
            });
        }

        return res
            .status(200)
            .json(maintenanceRequest);
    } catch (error) {
        console.error(
            "Get maintenance request error:",
            error
        );

        return res.status(500).json({
            message:
                "Unable to retrieve the maintenance request.",
            error: error.message
        });
    }
}

/**
 * POST /api/maintenance-requests
 */
async function createMaintenanceRequest(
    req,
    res
) {
    try {
        const validationError =
            validateMaintenanceRequest(
                req.body
            );

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const ticketNo =
            await generateUniqueTicketNumber();

        const newRequest =
            await maintenanceRequestsService
                .createMaintenanceRequest({
                    ticketNo,

                    title:
                        req.body.title.trim(),

                    description:
                        req.body.description
                            ?.trim() || null,

                    requestType:
                        req.body.requestType,

                    priority:
                        req.body.priority,

                    status:
                        req.body.status || "Open",

                    siteId:
                        Number(req.body.siteId),

                    assetId:
                        Number(req.body.assetId),

                    raisedBy:
                        Number(req.body.raisedBy),

                    assignedTo:
                        req.body.assignedTo
                            ? Number(
                                req.body.assignedTo
                            )
                            : null,

                    vendorId:
                        req.body.vendorId
                            ? Number(
                                req.body.vendorId
                            )
                            : null,

                    targetDate:
                        req.body.targetDate ||
                        null
                });

        return res.status(201).json(
            newRequest
        );
    } catch (error) {
        console.error(
            "Create maintenance request error:",
            error
        );

        return res.status(500).json({
            message:
                "Unable to create the maintenance request.",
            error: error.message
        });
    }
}

/**
 * PUT /api/maintenance-requests/:id
 */
async function updateMaintenanceRequest(
    req,
    res
) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message:
                    "Invalid maintenance request ID."
            });
        }

        const validationError =
            validateMaintenanceRequest(
                req.body
            );

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const existingRequest =
            await maintenanceRequestsService
                .getMaintenanceRequestById(id);

        if (!existingRequest) {
            return res.status(404).json({
                message:
                    "Maintenance request not found."
            });
        }

        const updatedRequest =
            await maintenanceRequestsService
                .updateMaintenanceRequest(
                    id,
                    {
                        title:
                            req.body.title.trim(),

                        description:
                            req.body.description
                                ?.trim() || null,

                        requestType:
                            req.body.requestType,

                        priority:
                            req.body.priority,

                        status:
                            req.body.status,

                        siteId:
                            Number(
                                req.body.siteId
                            ),

                        assetId:
                            Number(
                                req.body.assetId
                            ),

                        raisedBy:
                            Number(
                                req.body.raisedBy
                            ),

                        assignedTo:
                            req.body.assignedTo
                                ? Number(
                                    req.body
                                        .assignedTo
                                )
                                : null,

                        vendorId:
                            req.body.vendorId
                                ? Number(
                                    req.body.vendorId
                                )
                                : null,

                        targetDate:
                            req.body.targetDate ||
                            null
                    }
                );

        return res.status(200).json(
            updatedRequest
        );
    } catch (error) {
        console.error(
            "Update maintenance request error:",
            error
        );

        return res.status(500).json({
            message:
                "Unable to update the maintenance request.",
            error: error.message
        });
    }
}

/**
 * DELETE /api/maintenance-requests/:id
 */
async function deleteMaintenanceRequest(
    req,
    res
) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message:
                    "Invalid maintenance request ID."
            });
        }

        const existingRequest =
            await maintenanceRequestsService
                .getMaintenanceRequestById(id);

        if (!existingRequest) {
            return res.status(404).json({
                message:
                    "Maintenance request not found."
            });
        }

        const deletedRows =
            await maintenanceRequestsService
                .deleteMaintenanceRequest(id);

        if (deletedRows === 0) {
            return res.status(404).json({
                message:
                    "Maintenance request not found."
            });
        }

        return res.status(200).json({
            message:
                "Maintenance request deleted successfully."
        });
    } catch (error) {
        console.error(
            "Delete maintenance request error:",
            error
        );

        return res.status(500).json({
            message:
                "Unable to delete the maintenance request.",
            error: error.message
        });
    }
}

/**
 * Validate maintenance request fields.
 */
function validateMaintenanceRequest(data) {
    if (
        !data.title ||
        !String(data.title).trim()
    ) {
        return "Title is required.";
    }

    const requestTypes = [
        "Corrective",
        "Preventive",
        "Inspection",
        "Breakdown",
        "Upgrade"
    ];

    if (
        !requestTypes.includes(
            data.requestType
        )
    ) {
        return "A valid request type is required.";
    }

    const priorities = [
        "Low",
        "Medium",
        "High",
        "Critical"
    ];

    if (
        !priorities.includes(data.priority)
    ) {
        return "A valid priority is required.";
    }

    const statuses = [
        "Open",
        "Assigned",
        "In Progress",
        "Pending Vendor",
        "Completed",
        "Closed",
        "Cancelled"
    ];

    if (
        data.status &&
        !statuses.includes(data.status)
    ) {
        return "Invalid request status.";
    }

    const siteId = Number(data.siteId);
    const assetId = Number(data.assetId);
    const raisedBy = Number(data.raisedBy);

    if (
        !Number.isInteger(siteId) ||
        siteId <= 0
    ) {
        return "A valid site is required.";
    }

    if (
        !Number.isInteger(assetId) ||
        assetId <= 0
    ) {
        return "A valid asset is required.";
    }

    if (
        !Number.isInteger(raisedBy) ||
        raisedBy <= 0
    ) {
        return "A valid raised-by user is required.";
    }

    return null;
}

/**
 * Generate a unique ticket number.
 *
 * Example:
 * MR-20260806-143025-482
 */
async function generateUniqueTicketNumber() {
    for (let attempt = 0; attempt < 5; attempt += 1) {
        const now = new Date();

        const datePart = [
            now.getFullYear(),
            String(
                now.getMonth() + 1
            ).padStart(2, "0"),
            String(
                now.getDate()
            ).padStart(2, "0")
        ].join("");

        const timePart = [
            String(
                now.getHours()
            ).padStart(2, "0"),
            String(
                now.getMinutes()
            ).padStart(2, "0"),
            String(
                now.getSeconds()
            ).padStart(2, "0")
        ].join("");

        const randomPart = String(
            Math.floor(
                100 + Math.random() * 900
            )
        );

        const ticketNo =
            `MR-${datePart}-${timePart}-${randomPart}`;

        const exists =
            await maintenanceRequestsService
                .ticketNumberExists(ticketNo);

        if (!exists) {
            return ticketNo;
        }
    }

    throw new Error(
        "Unable to generate a unique ticket number."
    );
}

module.exports = {
    getAllMaintenanceRequests,
    getMaintenanceRequestById,
    createMaintenanceRequest,
    updateMaintenanceRequest,
    deleteMaintenanceRequest
};
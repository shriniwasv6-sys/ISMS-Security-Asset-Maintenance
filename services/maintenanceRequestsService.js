const sql = require("mssql");
const { poolPromise } = require("../config/db");

/**
 * Return all maintenance requests with related names.
 */
async function getAllMaintenanceRequests() {
    const pool = await poolPromise;

    const result = await pool.request().query(`
        SELECT
            mr.RequestId,
            mr.TicketNo,
            mr.Title,
            mr.Description,
            mr.RequestType,
            mr.Priority,
            mr.Status,

            mr.SiteId,
            s.SiteName,

            mr.AssetId,
            a.AssetName,
            a.AssetTag,

            mr.RaisedBy,
            raisedUser.FullName AS RaisedByName,

            mr.AssignedTo,
            assignedUser.FullName AS AssignedToName,

            mr.VendorId,
            v.VendorName,

            mr.DateRaised,
            mr.TargetDate

        FROM dbo.MaintenanceRequests mr

        INNER JOIN dbo.Sites s
            ON mr.SiteId = s.SiteId

        INNER JOIN dbo.Assets a
            ON mr.AssetId = a.AssetId

        INNER JOIN dbo.Users raisedUser
            ON mr.RaisedBy = raisedUser.UserId

        LEFT JOIN dbo.Users assignedUser
            ON mr.AssignedTo = assignedUser.UserId

        LEFT JOIN dbo.Vendors v
            ON mr.VendorId = v.VendorId

        ORDER BY
            mr.DateRaised DESC,
            mr.RequestId DESC;
    `);

    return result.recordset;
}

/**
 * Return one maintenance request by ID.
 */
async function getMaintenanceRequestById(id) {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("id", sql.Int, id)
        .query(`
            SELECT
                mr.RequestId,
                mr.TicketNo,
                mr.Title,
                mr.Description,
                mr.RequestType,
                mr.Priority,
                mr.Status,

                mr.SiteId,
                s.SiteName,

                mr.AssetId,
                a.AssetName,
                a.AssetTag,

                mr.RaisedBy,
                raisedUser.FullName AS RaisedByName,

                mr.AssignedTo,
                assignedUser.FullName AS AssignedToName,

                mr.VendorId,
                v.VendorName,

                mr.DateRaised,
                mr.TargetDate

            FROM dbo.MaintenanceRequests mr

            INNER JOIN dbo.Sites s
                ON mr.SiteId = s.SiteId

            INNER JOIN dbo.Assets a
                ON mr.AssetId = a.AssetId

            INNER JOIN dbo.Users raisedUser
                ON mr.RaisedBy = raisedUser.UserId

            LEFT JOIN dbo.Users assignedUser
                ON mr.AssignedTo = assignedUser.UserId

            LEFT JOIN dbo.Vendors v
                ON mr.VendorId = v.VendorId

            WHERE mr.RequestId = @id;
        `);

    return result.recordset[0] || null;
}

/**
 * Check whether a ticket number already exists.
 */
async function ticketNumberExists(ticketNo) {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input(
            "ticketNo",
            sql.VarChar(30),
            ticketNo
        )
        .query(`
            SELECT RequestId
            FROM dbo.MaintenanceRequests
            WHERE TicketNo = @ticketNo;
        `);

    return result.recordset.length > 0;
}

/**
 * Create a maintenance request.
 */
async function createMaintenanceRequest(requestData) {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input(
            "ticketNo",
            sql.VarChar(30),
            requestData.ticketNo
        )
        .input(
            "title",
            sql.VarChar(200),
            requestData.title
        )
        .input(
            "description",
            sql.VarChar(sql.MAX),
            requestData.description || null
        )
        .input(
            "requestType",
            sql.VarChar(30),
            requestData.requestType
        )
        .input(
            "priority",
            sql.VarChar(20),
            requestData.priority
        )
        .input(
            "status",
            sql.VarChar(30),
            requestData.status
        )
        .input(
            "siteId",
            sql.Int,
            requestData.siteId
        )
        .input(
            "assetId",
            sql.Int,
            requestData.assetId
        )
        .input(
            "raisedBy",
            sql.Int,
            requestData.raisedBy
        )
        .input(
            "assignedTo",
            sql.Int,
            requestData.assignedTo || null
        )
        .input(
            "vendorId",
            sql.Int,
            requestData.vendorId || null
        )
        .input(
            "targetDate",
            sql.Date,
            requestData.targetDate || null
        )
        .query(`
            INSERT INTO dbo.MaintenanceRequests
            (
                TicketNo,
                Title,
                Description,
                RequestType,
                Priority,
                Status,
                SiteId,
                AssetId,
                RaisedBy,
                AssignedTo,
                VendorId,
                DateRaised,
                TargetDate
            )
            VALUES
            (
                @ticketNo,
                @title,
                @description,
                @requestType,
                @priority,
                @status,
                @siteId,
                @assetId,
                @raisedBy,
                @assignedTo,
                @vendorId,
                GETDATE(),
                @targetDate
            );

            SELECT
                CAST(SCOPE_IDENTITY() AS INT)
                AS RequestId;
        `);

    const newRequestId =
        result.recordset[0].RequestId;

    return getMaintenanceRequestById(
        newRequestId
    );
}

/**
 * Update a maintenance request.
 */
async function updateMaintenanceRequest(
    id,
    requestData
) {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("id", sql.Int, id)
        .input(
            "title",
            sql.VarChar(200),
            requestData.title
        )
        .input(
            "description",
            sql.VarChar(sql.MAX),
            requestData.description || null
        )
        .input(
            "requestType",
            sql.VarChar(30),
            requestData.requestType
        )
        .input(
            "priority",
            sql.VarChar(20),
            requestData.priority
        )
        .input(
            "status",
            sql.VarChar(30),
            requestData.status
        )
        .input(
            "siteId",
            sql.Int,
            requestData.siteId
        )
        .input(
            "assetId",
            sql.Int,
            requestData.assetId
        )
        .input(
            "raisedBy",
            sql.Int,
            requestData.raisedBy
        )
        .input(
            "assignedTo",
            sql.Int,
            requestData.assignedTo || null
        )
        .input(
            "vendorId",
            sql.Int,
            requestData.vendorId || null
        )
        .input(
            "targetDate",
            sql.Date,
            requestData.targetDate || null
        )
        .query(`
            UPDATE dbo.MaintenanceRequests
            SET
                Title = @title,
                Description = @description,
                RequestType = @requestType,
                Priority = @priority,
                Status = @status,
                SiteId = @siteId,
                AssetId = @assetId,
                RaisedBy = @raisedBy,
                AssignedTo = @assignedTo,
                VendorId = @vendorId,
                TargetDate = @targetDate
            WHERE RequestId = @id;
        `);

    if (result.rowsAffected[0] === 0) {
        return null;
    }

    return getMaintenanceRequestById(id);
}

/**
 * Delete a maintenance request.
 */
async function deleteMaintenanceRequest(id) {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("id", sql.Int, id)
        .query(`
            DELETE FROM dbo.MaintenanceRequests
            WHERE RequestId = @id;
        `);

    return result.rowsAffected[0];
}

module.exports = {
    getAllMaintenanceRequests,
    getMaintenanceRequestById,
    ticketNumberExists,
    createMaintenanceRequest,
    updateMaintenanceRequest,
    deleteMaintenanceRequest
};
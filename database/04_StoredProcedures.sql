USE ISMS_DB;
GO

CREATE OR ALTER PROCEDURE dbo.sp_CreateMaintenanceRequest
    @TicketNo NVARCHAR(50),
    @Title NVARCHAR(200),
    @Description NVARCHAR(MAX) = NULL,
    @RequestType NVARCHAR(30),
    @Priority NVARCHAR(20),
    @SiteId INT,
    @AssetId INT = NULL,
    @RaisedBy INT,
    @AssignedTo INT = NULL,
    @VendorId INT = NULL,
    @TargetDate DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.MaintenanceRequests
    (TicketNo, Title, Description, RequestType, Priority, Status,
     SiteId, AssetId, RaisedBy, AssignedTo, VendorId, TargetDate)
    VALUES
    (@TicketNo, @Title, @Description, @RequestType, @Priority, 'Open',
     @SiteId, @AssetId, @RaisedBy, @AssignedTo, @VendorId, @TargetDate);

    SELECT SCOPE_IDENTITY() AS RequestId;
END;
GO

CREATE OR ALTER PROCEDURE dbo.sp_AssignEngineer
    @RequestId INT,
    @EngineerId INT,
    @UpdatedBy INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.MaintenanceRequests
    SET AssignedTo = @EngineerId,
        Status = 'Assigned',
        UpdatedAt = SYSDATETIME()
    WHERE RequestId = @RequestId;

    INSERT INTO dbo.RequestUpdates (RequestId, UpdatedBy, Remarks, Status)
    VALUES (@RequestId, @UpdatedBy, 'Engineer assigned.', 'Assigned');
END;
GO

CREATE OR ALTER PROCEDURE dbo.sp_UpdateRequestStatus
    @RequestId INT,
    @Status NVARCHAR(30),
    @UpdatedBy INT,
    @Remarks NVARCHAR(1000)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.MaintenanceRequests
    SET Status = @Status,
        UpdatedAt = SYSDATETIME()
    WHERE RequestId = @RequestId;

    INSERT INTO dbo.RequestUpdates (RequestId, UpdatedBy, Remarks, Status)
    VALUES (@RequestId, @UpdatedBy, @Remarks, @Status);
END;
GO

CREATE OR ALTER PROCEDURE dbo.sp_CloseRequest
    @RequestId INT,
    @ClosedBy INT,
    @Remarks NVARCHAR(1000) = 'Ticket closed.'
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.MaintenanceRequests
    SET Status = 'Closed',
        UpdatedAt = SYSDATETIME(),
        ClosedAt = SYSDATETIME()
    WHERE RequestId = @RequestId;

    INSERT INTO dbo.RequestUpdates (RequestId, UpdatedBy, Remarks, Status)
    VALUES (@RequestId, @ClosedBy, @Remarks, 'Closed');
END;
GO

CREATE OR ALTER PROCEDURE dbo.sp_GetDashboard
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        (SELECT COUNT(*) FROM dbo.Assets) AS TotalAssets,
        (SELECT COUNT(*) FROM dbo.MaintenanceRequests
         WHERE Status NOT IN ('Closed','Cancelled')) AS OpenRequests,
        (SELECT COUNT(*) FROM dbo.MaintenanceRequests
         WHERE Priority = 'Critical'
           AND Status NOT IN ('Closed','Cancelled')) AS CriticalRequests;
END;
GO

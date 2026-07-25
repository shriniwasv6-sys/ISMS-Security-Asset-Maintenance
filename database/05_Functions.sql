USE ISMS_DB;
GO

CREATE OR ALTER FUNCTION dbo.fn_TotalAssets()
RETURNS INT
AS
BEGIN
    DECLARE @Total INT;
    SELECT @Total = COUNT(*) FROM dbo.Assets;
    RETURN ISNULL(@Total, 0);
END;
GO

CREATE OR ALTER FUNCTION dbo.fn_TotalOpenRequests()
RETURNS INT
AS
BEGIN
    DECLARE @Total INT;
    SELECT @Total = COUNT(*)
    FROM dbo.MaintenanceRequests
    WHERE Status NOT IN ('Closed','Cancelled');
    RETURN ISNULL(@Total, 0);
END;
GO

CREATE OR ALTER FUNCTION dbo.fn_TotalCriticalRequests()
RETURNS INT
AS
BEGIN
    DECLARE @Total INT;
    SELECT @Total = COUNT(*)
    FROM dbo.MaintenanceRequests
    WHERE Priority = 'Critical'
      AND Status NOT IN ('Closed','Cancelled');
    RETURN ISNULL(@Total, 0);
END;
GO

CREATE OR ALTER FUNCTION dbo.fn_RequestAge(@RequestId INT)
RETURNS INT
AS
BEGIN
    DECLARE @Age INT;
    SELECT @Age = DATEDIFF(DAY, CreatedAt, COALESCE(ClosedAt, SYSDATETIME()))
    FROM dbo.MaintenanceRequests
    WHERE RequestId = @RequestId;
    RETURN ISNULL(@Age, 0);
END;
GO

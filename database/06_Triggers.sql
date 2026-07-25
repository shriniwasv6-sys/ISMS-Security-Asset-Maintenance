USE ISMS_DB;
GO

CREATE OR ALTER TRIGGER dbo.trg_MaintenanceRequest_StatusChange
ON dbo.MaintenanceRequests
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.AuditLogs (UserId, Action, TableName, RecordId)
    SELECT
        COALESCE(i.AssignedTo, i.RaisedBy),
        CONCAT('Maintenance request status updated to ', i.Status),
        'MaintenanceRequests',
        i.RequestId
    FROM inserted i
    JOIN deleted d ON i.RequestId = d.RequestId
    WHERE ISNULL(i.Status, '') <> ISNULL(d.Status, '');
END;
GO

USE ISMS_DB;
GO

CREATE OR ALTER VIEW dbo.vw_AssetSummary AS
SELECT a.AssetId, a.AssetName, a.AssetTag, ac.CategoryName,
       s.SiteName, v.VendorName, a.InstallationDate,
       a.WarrantyExpiry, a.Status
FROM dbo.Assets a
JOIN dbo.AssetCategories ac ON a.CategoryId = ac.CategoryId
JOIN dbo.Sites s ON a.SiteId = s.SiteId
LEFT JOIN dbo.Vendors v ON a.VendorId = v.VendorId;
GO

CREATE OR ALTER VIEW dbo.vw_OpenRequests AS
SELECT mr.RequestId, mr.TicketNo, mr.Title, mr.Priority, mr.Status,
       s.SiteName, a.AssetName, u.FullName AS AssignedEngineer,
       mr.TargetDate, mr.CreatedAt
FROM dbo.MaintenanceRequests mr
JOIN dbo.Sites s ON mr.SiteId = s.SiteId
LEFT JOIN dbo.Assets a ON mr.AssetId = a.AssetId
LEFT JOIN dbo.Users u ON mr.AssignedTo = u.UserId
WHERE mr.Status NOT IN ('Closed','Cancelled');
GO

CREATE OR ALTER VIEW dbo.vw_EngineerWorkload AS
SELECT u.UserId, u.FullName AS EngineerName,
       COUNT(mr.RequestId) AS AssignedRequestCount
FROM dbo.Users u
JOIN dbo.Roles r ON u.RoleId = r.RoleId
LEFT JOIN dbo.MaintenanceRequests mr
    ON u.UserId = mr.AssignedTo
   AND mr.Status NOT IN ('Closed','Cancelled')
WHERE r.RoleName = 'Engineer'
GROUP BY u.UserId, u.FullName;
GO

CREATE OR ALTER VIEW dbo.vw_VendorPerformance AS
SELECT v.VendorId, v.VendorName,
       COUNT(mr.RequestId) AS TotalRequests,
       SUM(CASE WHEN mr.Status = 'Closed' THEN 1 ELSE 0 END) AS ClosedRequests
FROM dbo.Vendors v
LEFT JOIN dbo.MaintenanceRequests mr ON v.VendorId = mr.VendorId
GROUP BY v.VendorId, v.VendorName;
GO

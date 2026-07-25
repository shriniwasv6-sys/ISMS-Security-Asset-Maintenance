USE ISMS_DB;
GO

INSERT INTO dbo.Roles (RoleName)
VALUES ('Admin'), ('Manager'), ('Engineer'), ('Vendor');
GO

-- Replace <HASHED_PASSWORD> with a valid bcrypt hash before first run.
INSERT INTO dbo.Users (FullName, Email, PasswordHash, Phone, RoleId)
VALUES
('Sharma Shriniwas','sharma@isimms.com','<HASHED_PASSWORD>','91234567',1),
('Eric Tan','erictan@isimms.com','<HASHED_PASSWORD>','92345678',2),
('Daniel Lim','daniel@isimms.com','<HASHED_PASSWORD>','93456789',3),
('Michelle Lim','michelle@isimms.com','<HASHED_PASSWORD>','94567890',4);
GO

INSERT INTO dbo.Sites (SiteName, Address)
VALUES
('Tech Polytechnic Block 2','21 Sims Avenue 1'),
('ABC Data Centre','100 Marina Drive');
GO

INSERT INTO dbo.Vendors (VendorName, ContactPerson, Phone, Email)
VALUES
('Lim Hong Engineering','Paulina','61234567','paulina@limhong.com'),
('Asia Fire Protection','Song Kai Xin','62345678','sales@asiafire.com');
GO

INSERT INTO dbo.AssetCategories (CategoryName, Description)
VALUES
('Fire Alarm System','Fire alarm panels and related equipment'),
('UPS System','Uninterruptible power supply equipment'),
('CCTV System','CCTV cameras, servers and recording equipment');
GO

INSERT INTO dbo.Assets
(AssetName, AssetTag, CategoryId, SiteId, VendorId, InstallationDate, WarrantyExpiry, Status)
VALUES
('Fire Alarm Panel','FA-001',1,1,1,'2024-01-15','2027-01-15','Active'),
('UPS System','UPS-001',2,2,2,'2023-09-10','2026-09-10','Active'),
('CCTV Server','CCTV-001',3,2,1,'2024-04-05','2027-04-05','Active');
GO

INSERT INTO dbo.MaintenanceRequests
(TicketNo, Title, Description, RequestType, Priority, Status, SiteId, AssetId, RaisedBy, AssignedTo, VendorId, TargetDate)
VALUES
('MR-2026-001','Quarterly Fire Alarm Inspection','Routine preventive maintenance.','Preventive','Medium','Assigned',1,1,1,3,1,'2026-07-15'),
('MR-2026-002','UPS Battery Failure','UPS battery replacement required.','Corrective','High','Open',2,2,2,3,2,'2026-07-10'),
('MR-2026-003','CCTV Server Offline','Server unreachable from monitoring system.','Emergency','Critical','In Progress',2,3,1,3,1,'2026-07-02');
GO

INSERT INTO dbo.RequestUpdates (RequestId, UpdatedBy, Remarks, Status)
VALUES
(1,3,'Engineer assigned.','Assigned'),
(1,3,'Inspection scheduled.','In Progress'),
(2,3,'Battery replacement ordered.','Pending Vendor'),
(3,3,'Server reboot completed.','Resolved'),
(3,1,'Ticket closed.','Closed');
GO

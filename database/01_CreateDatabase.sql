IF DB_ID('ISMS_DB') IS NULL
    CREATE DATABASE ISMS_DB;
GO

USE ISMS_DB;
GO

CREATE TABLE dbo.Roles (
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL UNIQUE
);
GO

CREATE TABLE dbo.Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(120) NOT NULL,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Phone NVARCHAR(20),
    RoleId INT NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleId) REFERENCES dbo.Roles(RoleId)
);
GO

CREATE TABLE dbo.Sites (
    SiteId INT IDENTITY(1,1) PRIMARY KEY,
    SiteName NVARCHAR(150) NOT NULL,
    Address NVARCHAR(300) NOT NULL
);
GO

CREATE TABLE dbo.Vendors (
    VendorId INT IDENTITY(1,1) PRIMARY KEY,
    VendorName NVARCHAR(150) NOT NULL,
    ContactPerson NVARCHAR(120),
    Phone NVARCHAR(20),
    Email NVARCHAR(150)
);
GO

CREATE TABLE dbo.AssetCategories (
    CategoryId INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(120) NOT NULL UNIQUE,
    Description NVARCHAR(500)
);
GO

CREATE TABLE dbo.Assets (
    AssetId INT IDENTITY(1,1) PRIMARY KEY,
    AssetName NVARCHAR(150) NOT NULL,
    AssetTag NVARCHAR(80) NOT NULL UNIQUE,
    CategoryId INT NOT NULL,
    SiteId INT NOT NULL,
    VendorId INT,
    InstallationDate DATE,
    WarrantyExpiry DATE,
    Status NVARCHAR(30) NOT NULL DEFAULT 'Active',
    CONSTRAINT FK_Assets_Categories FOREIGN KEY (CategoryId) REFERENCES dbo.AssetCategories(CategoryId),
    CONSTRAINT FK_Assets_Sites FOREIGN KEY (SiteId) REFERENCES dbo.Sites(SiteId),
    CONSTRAINT FK_Assets_Vendors FOREIGN KEY (VendorId) REFERENCES dbo.Vendors(VendorId)
);
GO

CREATE TABLE dbo.MaintenanceRequests (
    RequestId INT IDENTITY(1,1) PRIMARY KEY,
    TicketNo NVARCHAR(50) NOT NULL UNIQUE,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    RequestType NVARCHAR(30) NOT NULL,
    Priority NVARCHAR(20) NOT NULL,
    Status NVARCHAR(30) NOT NULL,
    SiteId INT NOT NULL,
    AssetId INT,
    RaisedBy INT NOT NULL,
    AssignedTo INT,
    VendorId INT,
    TargetDate DATE,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2,
    ClosedAt DATETIME2,
    CONSTRAINT FK_MR_Sites FOREIGN KEY (SiteId) REFERENCES dbo.Sites(SiteId),
    CONSTRAINT FK_MR_Assets FOREIGN KEY (AssetId) REFERENCES dbo.Assets(AssetId),
    CONSTRAINT FK_MR_RaisedBy FOREIGN KEY (RaisedBy) REFERENCES dbo.Users(UserId),
    CONSTRAINT FK_MR_AssignedTo FOREIGN KEY (AssignedTo) REFERENCES dbo.Users(UserId),
    CONSTRAINT FK_MR_Vendors FOREIGN KEY (VendorId) REFERENCES dbo.Vendors(VendorId)
);
GO

CREATE TABLE dbo.RequestUpdates (
    UpdateId INT IDENTITY(1,1) PRIMARY KEY,
    RequestId INT NOT NULL,
    UpdatedBy INT NOT NULL,
    Remarks NVARCHAR(1000) NOT NULL,
    Status NVARCHAR(30) NOT NULL,
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_RequestUpdates_Requests FOREIGN KEY (RequestId) REFERENCES dbo.MaintenanceRequests(RequestId),
    CONSTRAINT FK_RequestUpdates_Users FOREIGN KEY (UpdatedBy) REFERENCES dbo.Users(UserId)
);
GO

CREATE TABLE dbo.AuditLogs (
    AuditId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NULL,
    Action NVARCHAR(250) NOT NULL,
    TableName NVARCHAR(100) NOT NULL,
    RecordId INT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_AuditLogs_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId)
);
GO

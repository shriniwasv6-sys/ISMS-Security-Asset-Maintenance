# Integrated Security Management System (ISMS)

## Server-Side Development (SSD2026APR)

### Project Theme
Industrial Relevance

---

# Project Overview

The **Integrated Security Management System (ISMS)** is a RESTful backend application developed using **Node.js**, **Express.js**, and **Microsoft SQL Server**.

The purpose of the system is to manage security assets, customer sites, vendors, users, and maintenance operations through secure REST APIs.

---

# Technology Stack

- Node.js
- Express.js
- Microsoft SQL Server
- JWT Authentication
- bcrypt Password Hashing
- Express Validator
- Swagger (In Progress)
- Git & GitHub
- Postman

---

# Project Structure

```
ISMS-Security-Asset-Maintenance
│
├── config
├── controllers
├── middleware
├── routes
├── services
├── validators
├── utils
├── database
├── tests
├── docs
├── swagger
├── report
├── presentation
│
├── app.js
├── server.js
├── package.json
├── README.md
├── PROJECT_PROGRESS.md
└── .env.example
```

---

# Database

Database Name

```
ISMS_DB
```

Tables

- Roles
- Users
- Sites
- Vendors
- AssetCategories
- Assets
- MaintenanceRequests
- RequestUpdates
- AuditLogs

---

# SQL Server Features

Views

- vw_AssetSummary
- vw_OpenRequests
- vw_EngineerWorkload
- vw_VendorPerformance

Stored Procedures

- sp_CreateMaintenanceRequest
- sp_AssignEngineer
- sp_UpdateRequestStatus
- sp_CloseRequest
- sp_GetDashboard

Functions

- fn_TotalAssets
- fn_TotalOpenRequests
- fn_TotalCriticalRequests
- fn_RequestAge

Trigger

- trg_MaintenanceRequest_StatusChange

---

# Installation

## 1. Clone Repository

```bash
git clone https://github.com/shriniwasv6-sys/ISMS-Security-Asset-Maintenance.git
```

---

## 2. Enter Project

```bash
cd ISMS-Security-Asset-Maintenance
```

---

## 3. Install Packages

```bash
npm install
```

---

## 4. Create Environment File

Copy

```
.env.example
```

to

```
.env
```

Example

```env
PORT=3000

DB_SERVER=localhost\SQLEXPRESS
DB_DATABASE=ISMS_DB
DB_USER=sa
DB_PASSWORD=YOUR_PASSWORD

JWT_SECRET=YOUR_SECRET
JWT_EXPIRES_IN=1d
```

---

## 5. Create Database

Execute the SQL scripts in this order:

```
database/01_CreateDatabase.sql

database/02_InsertSampleData.sql

database/03_Views.sql

database/04_StoredProcedures.sql

database/05_Functions.sql

database/06_Triggers.sql
```

---

## 6. Run Application

```bash
npm start
```

Expected Output

```
ISMS API running on port 3000

Connected to SQL Server
```

---

# Authentication

Login

```
POST

/api/auth/login
```

Example

```json
{
  "email":"sharma@isimms.com",
  "password":"Password@123"
}
```

---

# Health API

```
GET

/api/v1/health
```

---

# Users API

```
GET

/api/users
```

```
GET

/api/users/{id}
```

```
POST

/api/users
```

```
PUT

/api/users/{id}
```

```
DELETE

/api/users/{id}
```

---

# Sites API

```
GET

/api/sites
```

```
POST

/api/sites
```

```
PUT

/api/sites/{id}
```

```
DELETE

/api/sites/{id}
```

---

# Vendors API

```
GET

/api/vendors
```

```
POST

/api/vendors
```

```
PUT

/api/vendors/{id}
```

```
DELETE

/api/vendors/{id}
```

---

# Asset Categories API

```
GET

/api/asset-categories
```

```
POST

/api/asset-categories
```

```
PUT

/api/asset-categories/{id}
```

```
DELETE

/api/asset-categories/{id}
```

---

# Current Project Status

| Module | Status |
|---------|:------:|
| SQL Server Database | ✅ |
| JWT Authentication | ✅ |
| Health API | ✅ |
| Users CRUD | ✅ |
| Sites CRUD | ✅ |
| Vendors CRUD | ✅ |
| Asset Categories CRUD | ✅ |
| Assets CRUD | 🚧 In Progress |
| Maintenance Requests | 🚧 In Progress |
| Dashboard | 🚧 In Progress |
| Swagger | 🚧 In Progress |

---

# GitHub

Repository

https://github.com/shriniwasv6-sys/ISMS-Security-Asset-Maintenance

---

# Author

**Sharma Shriniwas**

Server-Side Development (SSD2026APR)

Integrated Security Management System (ISMS)

2026
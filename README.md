# Integrated Security Management System (ISMS)

## Security Asset Maintenance Application

The Integrated Security Management System, or ISMS, is a full-stack web application developed for managing security assets, maintenance requests, sites, vendors, users, and reporting information.

The application was created for the Server-Side Development assignment using Node.js, Express.js, Microsoft SQL Server, REST APIs, HTML, CSS, and JavaScript.

---

## Student Information

**Student Name:** Vishwakarma Shriniwas
**Student ID:** 7069107M  
**Module:** Server-Side Development  
**Course:** Diploma in Full-Stack Development  
**Academic Year:** AY2026/2027  
**Project Theme:** Industrial Relevance  

**GitHub Repository:**  
https://github.com/shriniwasv6-sys/ISMS-Security-Asset-Maintenance

---

## Project Overview

Security systems such as card access systems, CCTV systems, fire alarm systems, intercom systems, UPS systems, and barrier systems require regular maintenance.

Organisations often manage these assets using spreadsheets, email, manual records, or separate applications. This can make it difficult to track:

- asset locations;
- asset warranty expiry dates;
- vendors;
- maintenance requests;
- assigned engineers;
- request priorities;
- request statuses;
- completed maintenance work.

The ISMS application provides one central system for managing security assets and maintenance activities.

---

## Main Objectives

The objectives of this project are to:

- develop a backend application using Node.js and Express.js;
- connect the application to Microsoft SQL Server;
- implement REST API endpoints;
- provide complete CRUD functionality;
- manage related database tables;
- implement authentication and security controls;
- provide a frontend interface for users;
- generate reports and system summaries;
- document and test the application.

---

## Technologies Used

### Backend

- Node.js
- Express.js
- CommonJS
- REST API

### Database

- Microsoft SQL Server
- MSSQL Node.js library
- Parameterized SQL queries

### Frontend

- HTML5
- CSS3
- JavaScript
- Fetch API

### Security

- JSON Web Token
- bcrypt
- bcryptjs
- Authentication middleware
- Protected API routes

### Testing

- Jest
- Supertest

### API Documentation

- Swagger UI Express
- Swagger JSDoc

### Logging and Development

- Morgan
- Winston
- Nodemon
- dotenv

---

## Application Features

### Authentication

- Login using email and password
- Password hashing
- JWT token generation
- Protected frontend pages
- Protected REST API endpoints
- Logout function

### Dashboard

The dashboard displays:

- total users;
- total sites;
- total vendors;
- total asset categories;
- database connection status;
- system health information;
- navigation to all modules.

### User Management

The Users module supports:

- create user;
- view users;
- edit user;
- delete user;
- search users;
- display user role;
- display phone number;
- display creation date.

### Site Management

The Sites module supports:

- create site;
- view sites;
- edit site;
- delete site;
- search sites;
- store site address;
- store contact person;
- store contact number;
- display creation date.

### Vendor Management

The Vendors module supports:

- create vendor;
- view vendors;
- edit vendor;
- delete vendor;
- search vendors;
- store contact person;
- store email;
- store phone number;
- display creation date.

### Asset Category Management

The Asset Categories module supports:

- create asset category;
- view asset categories;
- edit asset category;
- delete asset category;
- search asset categories;
- store category description;
- display creation date.

### Asset Management

The Assets module supports:

- create asset;
- view assets;
- edit asset;
- delete asset;
- search assets;
- assign asset category;
- assign site;
- assign vendor;
- store asset tag;
- store installation date;
- store warranty expiry date;
- manage asset status.

### Maintenance Request Management

The Maintenance Requests module supports:

- create maintenance request;
- automatically generate ticket number;
- view maintenance requests;
- edit maintenance request;
- delete maintenance request;
- search maintenance requests;
- assign site;
- assign asset;
- assign engineer;
- assign vendor;
- store request type;
- store priority;
- store status;
- store target date;
- store description;
- display description under the request title.

### Reports

The Reports module displays:

- total users;
- total sites;
- total vendors;
- total asset categories;
- total assets;
- total maintenance requests;
- open requests;
- in-progress requests;
- critical requests;
- completed requests;
- assets grouped by status;
- requests grouped by priority;
- latest maintenance requests.

The Reports page also supports:

- CSV export;
- printing;
- searching maintenance records;
- refreshing report data.

### Settings

The Settings module supports:

- system name;
- organisation name;
- support email;
- support phone;
- time zone;
- date format;
- notification preferences;
- account information;
- application version;
- database health information.

Settings are stored locally in the browser.

---

## Database Tables

The application uses the following related tables:

- Roles
- Users
- Sites
- Vendors
- AssetCategories
- Assets
- MaintenanceRequests
- RequestUpdates
- AuditLogs

Important relationships include:

- Users are linked to Roles.
- Assets are linked to AssetCategories.
- Assets are linked to Sites.
- Assets are linked to Vendors.
- MaintenanceRequests are linked to Sites.
- MaintenanceRequests are linked to Assets.
- MaintenanceRequests are linked to Users.
- MaintenanceRequests may be linked to Vendors.

---

## Project Structure

```text
ISMS-Security-Asset-Maintenance/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── assetCategoriesController.js
│   ├── assetsController.js
│   ├── authController.js
│   ├── maintenanceRequestsController.js
│   ├── sitesController.js
│   ├── usersController.js
│   └── vendorsController.js
│
├── database/
│   ├── 01_CreateDatabase.sql
│   ├── 02_InsertSampleData.sql
│   ├── 03_Views.sql
│   ├── 04_StoredProcedures.sql
│   ├── 05_Functions.sql
│   └── 06_Triggers.sql
│
├── middleware/
│   └── authMiddleware.js
│
├── public/
│   ├── css/
│   │   └── main.css
│   │
│   ├── js/
│   │   ├── api.js
│   │   ├── asset-categories.js
│   │   ├── assets.js
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── layout.js
│   │   ├── login.js
│   │   ├── maintenance-requests.js
│   │   ├── reports.js
│   │   ├── settings.js
│   │   ├── sites.js
│   │   ├── users.js
│   │   └── vendors.js
│   │
│   ├── asset-categories.html
│   ├── assets.html
│   ├── dashboard.html
│   ├── index.html
│   ├── login.html
│   ├── maintenance-requests.html
│   ├── reports.html
│   ├── settings.html
│   ├── sites.html
│   ├── users.html
│   └── vendors.html
│
├── routes/
│   ├── assetCategoriesRoutes.js
│   ├── assetsRoutes.js
│   ├── authRoutes.js
│   ├── maintenanceRequestsRoutes.js
│   ├── sitesRoutes.js
│   ├── usersRoutes.js
│   └── vendorsRoutes.js
│
├── services/
│   ├── assetCategoriesService.js
│   ├── assetsService.js
│   ├── maintenanceRequestsService.js
│   ├── sitesService.js
│   ├── usersService.js
│   └── vendorsService.js
│
├── swagger/
│   └── swagger.js
│
├── tests/
│   ├── assets.test.js
│   ├── auth.test.js
│   └── maintenanceRequests.test.js
│
├── .env
├── .gitignore
├── app.js
├── package.json
├── package-lock.json
├── PROJECT_PROGRESS.md
├── README.md
├── server.js
└── test-db.js
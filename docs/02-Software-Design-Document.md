# BarMaster Cameroon

# Software Design Document (SDD)

Version: 1.0

Author: Samuel Fombang

---

# Table of Contents

1. System Architecture
2. System Modules
3. Backend Architecture
4. Frontend Architecture
5. Database Architecture
6. Inventory Workflow
7. API Architecture
8. Security
9. Project Structure
10. Future Expansion

---

# 1. System Architecture

BarMaster Cameroon is a three-tier application.

+----------------------+
| React Frontend |
+----------+-----------+
|
REST API
|
+----------+-----------+
| ASP.NET Core API |
+----------+-----------+
|
MongoDB Driver
|
+----------+-----------+
| MongoDB Atlas |
+----------------------+

---

# 2. System Modules

Dashboard

Master Data

• Categories

• Brands

• Suppliers

• Drinks

• Workers

Inventory

• Locations

• Inventory

• Stock Movements

Operations

• Purchases

• Transfers

• Sales

• Returns

Finance

• Expenses

• Cash Reconciliation

Reports

• Sales Reports

• Inventory Reports

• Profit Reports

Administration

• Users

• Roles

• Settings

---

# 3. Backend Architecture

The backend follows Clean Architecture principles.

Controllers

↓

Services

↓

Repositories

↓

MongoDB

Responsibilities

Controllers

Receive HTTP requests.

Services

Business logic.

Repositories

Database operations.

MongoDB

Stores application data.

---

# 4. Frontend Architecture

The frontend is built using React.

Folders

components

Reusable UI components.

pages

Application pages.

services

REST API communication.

types

TypeScript interfaces.

layouts

Main application layout.

hooks

Reusable React hooks.

---

# 5. Database Architecture

Collections

Users

Roles

Workers

Categories

Brands

Suppliers

Drinks

Locations

Inventory

StockMovements

Purchases

PurchaseItems

Transfers

TransferItems

Sales

SaleItems

Expenses

ShiftHandovers

Settings

---

# 6. Inventory Workflow

Supplier

↓

Purchase

↓

Warehouse

↓

Transfer

↓

Bar

↓

Sales

↓

Customer

Every movement is stored in StockMovements.

---

# 7. API Architecture

Example endpoints

/api/categories

/api/brands

/api/suppliers

/api/drinks

/api/locations

/api/inventory

/api/transfers

/api/purchases

/api/sales

/api/reports

Each module provides

GET

POST

PUT

DELETE

---

# 8. Security

Authentication

Login required.

Authorization

Role-based access.

Manager

Full access.

Storekeeper

Warehouse operations.

Bartender

Sales operations.

Passwords

Encrypted before storage.

Audit Log

Every important action is recorded.

---

# 9. Project Structure

BarMaster-Cameroon

backend/

Controllers

DTOs

Models

Repositories

Services

Data

Settings

frontend/

components/

pages/

services/

types/

layouts/

docs/

README.md

---

# 10. Future Expansion

Future versions may support:

Multiple branches

Barcode scanning

QR codes

Android application

iPhone application

Cloud synchronization

Business intelligence dashboard

AI sales forecasting

Offline mode

---

End of Document
# BarMaster Cameroon

# API Documentation

Version: 1.0

Author: Samuel Fombang

---

# Table of Contents

1. API Overview
2. Base URL
3. Response Format
4. Error Format
5. Authentication
6. Categories API
7. Brands API
8. Suppliers API
9. Drinks API
10. Locations API
11. Inventory API
12. Stock Movements API
13. Purchases API
14. Transfers API
15. Sales API
16. Workers API
17. Expenses API
18. Shift Handover API
19. Reports API
20. Settings API

---

# 1. API Overview

BarMaster Cameroon uses a REST API built with ASP.NET Core Web API.

The frontend communicates with the backend using JSON.

The backend communicates with MongoDB Atlas using the MongoDB C# Driver.

Main request methods:

```text
GET
POST
PUT
DELETE
```

---

# 2. Base URL

Development:

```text
http://localhost:5028/api
```

Example:

```text
http://localhost:5028/api/Drinks
```

Production will use the deployed backend URL.

---

# 3. Response Format

Successful single-record response:

```json
{
  "id": "object-id",
  "name": "Example"
}
```

Successful list response:

```json
[
  {
    "id": "object-id-1",
    "name": "Example 1"
  },
  {
    "id": "object-id-2",
    "name": "Example 2"
  }
]
```

Successful message response:

```json
{
  "message": "Operation completed successfully."
}
```

---

# 4. Error Format

Validation error:

```json
{
  "message": "Validation failed.",
  "errors": {
    "name": [
      "Name is required."
    ]
  }
}
```

Not found:

```json
{
  "message": "Record not found."
}
```

Conflict:

```json
{
  "message": "A record with this name already exists."
}
```

Server error:

```json
{
  "message": "An unexpected error occurred."
}
```

---

# 5. Authentication

Future secured requests will use JWT authentication.

Login endpoint:

```text
POST /api/auth/login
```

Example request:

```json
{
  "username": "manager",
  "password": "password"
}
```

Example response:

```json
{
  "token": "jwt-token",
  "expiresAt": "2026-08-02T18:00:00Z",
  "user": {
    "id": "user-id",
    "username": "manager",
    "role": "Manager"
  }
}
```

Protected requests will send:

```text
Authorization: Bearer JWT_TOKEN
```

---

# 6. Categories API

## Get all categories

```text
GET /api/categories
```

## Get category by ID

```text
GET /api/categories/{id}
```

## Create category

```text
POST /api/categories
```

Request:

```json
{
  "name": "Alcoholic Drinks",
  "description": "Beer, wine and spirits",
  "isActive": true
}
```

## Update category

```text
PUT /api/categories/{id}
```

## Delete category

```text
DELETE /api/categories/{id}
```

---

# 7. Brands API

## Get all brands

```text
GET /api/brands
```

## Get brand by ID

```text
GET /api/brands/{id}
```

## Create brand

```text
POST /api/brands
```

Request:

```json
{
  "name": "Guinness Cameroon",
  "description": "Guinness products",
  "isActive": true
}
```

## Update brand

```text
PUT /api/brands/{id}
```

## Delete brand

```text
DELETE /api/brands/{id}
```

---

# 8. Suppliers API

## Get all suppliers

```text
GET /api/suppliers
```

## Get supplier by ID

```text
GET /api/suppliers/{id}
```

## Create supplier

```text
POST /api/suppliers
```

Request:

```json
{
  "name": "Brasseries du Cameroun Distribution",
  "contactPerson": "John",
  "phone": "+237670000000",
  "email": "sales@example.cm",
  "address": "Douala, Cameroon",
  "notes": "Main beer supplier",
  "isActive": true
}
```

## Update supplier

```text
PUT /api/suppliers/{id}
```

## Delete supplier

```text
DELETE /api/suppliers/{id}
```

---

# 9. Drinks API

## Get all drinks

```text
GET /api/drinks
```

## Get drink by ID

```text
GET /api/drinks/{id}
```

## Create drink

```text
POST /api/drinks
```

Request:

```json
{
  "name": "Guinness",
  "categoryId": "category-id",
  "brandId": "brand-id",
  "bottleSize": "65 cl",
  "barcode": "",
  "buyingPrice": 650,
  "sellingPrice": 800,
  "minimumStock": 20,
  "isActive": true
}
```

## Update drink

```text
PUT /api/drinks/{id}
```

## Delete drink

```text
DELETE /api/drinks/{id}
```

---

# 10. Locations API

## Get all locations

```text
GET /api/locations
```

## Get location by ID

```text
GET /api/locations/{id}
```

## Create location

```text
POST /api/locations
```

Request:

```json
{
  "name": "Main Warehouse",
  "type": "Warehouse",
  "address": "Limbe, Cameroon",
  "description": "Main storage location",
  "isActive": true
}
```

Allowed location types:

```text
Warehouse
SalesArea
DamagedStock
```

## Update location

```text
PUT /api/locations/{id}
```

## Delete location

```text
DELETE /api/locations/{id}
```

---

# 11. Inventory API

## Get all inventory

```text
GET /api/inventory
```

## Get inventory by location

```text
GET /api/inventory/location/{locationId}
```

## Get inventory by drink

```text
GET /api/inventory/drink/{drinkId}
```

## Get one drink at one location

```text
GET /api/inventory/location/{locationId}/drink/{drinkId}
```

## Create opening inventory

```text
POST /api/inventory
```

Request:

```json
{
  "drinkId": "drink-id",
  "locationId": "location-id",
  "quantity": 300,
  "minimumQuantity": 20,
  "isActive": true
}
```

## Update inventory minimum level

```text
PUT /api/inventory/{id}
```

Request:

```json
{
  "minimumQuantity": 30,
  "isActive": true
}
```

Direct quantity changes should normally happen through stock movements, purchases, transfers or sales.

---

# 12. Stock Movements API

## Get all stock movements

```text
GET /api/stockmovements
```

## Get movement by ID

```text
GET /api/stockmovements/{id}
```

## Get movements by drink

```text
GET /api/stockmovements/drink/{drinkId}
```

## Get movements by location

```text
GET /api/stockmovements/location/{locationId}
```

## Create stock adjustment

```text
POST /api/stockmovements/adjustment
```

Request:

```json
{
  "drinkId": "drink-id",
  "locationId": "location-id",
  "movementType": "ADJUSTMENT_IN",
  "quantity": 10,
  "reason": "Physical stock count correction"
}
```

Allowed movement types:

```text
PURCHASE
TRANSFER
SALE
RETURN
DAMAGE
ADJUSTMENT_IN
ADJUSTMENT_OUT
OPENING_BALANCE
```

---

# 13. Purchases API

## Get all purchases

```text
GET /api/purchases
```

## Get purchase by ID

```text
GET /api/purchases/{id}
```

## Create purchase

```text
POST /api/purchases
```

Request:

```json
{
  "supplierId": "supplier-id",
  "destinationLocationId": "warehouse-location-id",
  "invoiceNumber": "INV-0001",
  "purchaseDate": "2026-08-02T09:00:00Z",
  "paymentStatus": "Paid",
  "notes": "Morning delivery",
  "items": [
    {
      "drinkId": "drink-id-1",
      "quantity": 100,
      "unitBuyingPrice": 650
    },
    {
      "drinkId": "drink-id-2",
      "quantity": 80,
      "unitBuyingPrice": 500
    }
  ]
}
```

Expected effects:

1. Purchase is created.
2. Purchase items are created.
3. Warehouse inventory increases.
4. PURCHASE stock movements are created.

## Cancel purchase

```text
POST /api/purchases/{id}/cancel
```

Request:

```json
{
  "reason": "Supplier invoice cancelled"
}
```

Completed purchases should not be edited directly.

---

# 14. Transfers API

## Get all transfers

```text
GET /api/transfers
```

## Get transfer by ID

```text
GET /api/transfers/{id}
```

## Create transfer

```text
POST /api/transfers
```

Request:

```json
{
  "sourceLocationId": "warehouse-location-id",
  "destinationLocationId": "bar-location-id",
  "transferDate": "2026-08-02T10:00:00Z",
  "receivedBy": "worker-id",
  "reason": "Morning bar opening",
  "items": [
    {
      "drinkId": "drink-id-1",
      "quantity": 40
    },
    {
      "drinkId": "drink-id-2",
      "quantity": 30
    }
  ]
}
```

Expected effects:

1. Source inventory decreases.
2. Destination inventory increases.
3. TRANSFER stock movements are created.
4. Transfer record is saved.

## Complete transfer

```text
POST /api/transfers/{id}/complete
```

## Cancel transfer

```text
POST /api/transfers/{id}/cancel
```

---

# 15. Sales API

## Get all sales

```text
GET /api/sales
```

## Get sale by ID

```text
GET /api/sales/{id}
```

## Create sale

```text
POST /api/sales
```

Request:

```json
{
  "locationId": "bar-location-id",
  "shiftId": "shift-id",
  "saleDate": "2026-08-02T12:00:00Z",
  "discount": 0,
  "paymentMethod": "Cash",
  "paymentStatus": "Paid",
  "customerName": "",
  "items": [
    {
      "drinkId": "drink-id-1",
      "quantity": 2
    },
    {
      "drinkId": "drink-id-2",
      "quantity": 1
    }
  ]
}
```

Expected effects:

1. Bar inventory is checked.
2. Sale and sale items are created.
3. Bar inventory decreases.
4. SALE stock movements are created.
5. Profit is calculated.

## Cancel sale

```text
POST /api/sales/{id}/cancel
```

Request:

```json
{
  "reason": "Sale entered by mistake"
}
```

---

# 16. Workers API

## Get all workers

```text
GET /api/workers
```

## Get worker by ID

```text
GET /api/workers/{id}
```

## Create worker

```text
POST /api/workers
```

Request:

```json
{
  "fullName": "Mary Njie",
  "phone": "+237670000000",
  "email": "",
  "address": "Limbe",
  "jobTitle": "Bartender",
  "hireDate": "2026-08-02",
  "isActive": true
}
```

## Update worker

```text
PUT /api/workers/{id}
```

## Delete worker

```text
DELETE /api/workers/{id}
```

---

# 17. Expenses API

## Get all expenses

```text
GET /api/expenses
```

## Get expense by ID

```text
GET /api/expenses/{id}
```

## Create expense

```text
POST /api/expenses
```

Request:

```json
{
  "category": "Transport",
  "description": "Transport for drink delivery",
  "amount": 15000,
  "expenseDate": "2026-08-02T08:00:00Z",
  "paymentMethod": "Cash"
}
```

## Update expense

```text
PUT /api/expenses/{id}
```

## Delete expense

```text
DELETE /api/expenses/{id}
```

---

# 18. Shift Handover API

## Get all shifts

```text
GET /api/shifts
```

## Get shift by ID

```text
GET /api/shifts/{id}
```

## Open shift

```text
POST /api/shifts/open
```

Request:

```json
{
  "locationId": "bar-location-id",
  "workerId": "worker-id",
  "openingDateTime": "2026-08-02T08:00:00Z"
}
```

## Close shift

```text
POST /api/shifts/{id}/close
```

Request:

```json
{
  "actualCash": 125000,
  "notes": "One bottle damaged"
}
```

## Handover shift

```text
POST /api/shifts/{id}/handover
```

Request:

```json
{
  "incomingWorkerId": "incoming-worker-id",
  "notes": "Evening shift received"
}
```

---

# 19. Reports API

## Dashboard summary

```text
GET /api/reports/dashboard
```

## Daily sales report

```text
GET /api/reports/sales/daily?date=2026-08-02
```

## Weekly sales report

```text
GET /api/reports/sales/weekly?startDate=2026-08-01
```

## Monthly sales report

```text
GET /api/reports/sales/monthly?year=2026&month=8
```

## Profit report

```text
GET /api/reports/profit?startDate=2026-08-01&endDate=2026-08-31
```

## Inventory report

```text
GET /api/reports/inventory
```

## Inventory by location

```text
GET /api/reports/inventory/location/{locationId}
```

## Low stock report

```text
GET /api/reports/inventory/low-stock
```

## Purchase report

```text
GET /api/reports/purchases?startDate=2026-08-01&endDate=2026-08-31
```

## Transfer report

```text
GET /api/reports/transfers?startDate=2026-08-01&endDate=2026-08-31
```

## Worker performance report

```text
GET /api/reports/workers/{workerId}
```

---

# 20. Settings API

## Get settings

```text
GET /api/settings
```

## Update settings

```text
PUT /api/settings
```

Request:

```json
{
  "businessName": "BarMaster Cameroon",
  "address": "Limbe, Cameroon",
  "phone": "+237670000000",
  "email": "",
  "currency": "FCFA",
  "receiptFooter": "Thank you for your patronage.",
  "lowStockNotifications": true
}
```

---

# HTTP Status Codes

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
500 Internal Server Error
```

---

# API Business Rules

1. A purchase must increase inventory only at a warehouse location.

2. A transfer must use different source and destination locations.

3. A transfer cannot exceed available source stock.

4. A sale must reduce inventory only at a SalesArea location.

5. A sale cannot exceed available bar stock.

6. Completed purchases, transfers and sales must not be edited directly.

7. Cancellation must record the user, date and reason.

8. Every inventory-changing transaction must create stock movement records.

9. Every protected request must identify the current user.

10. Managers may approve sensitive adjustments and cancellations.

---

End of Document
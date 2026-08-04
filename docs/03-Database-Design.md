# BarMaster Cameroon

# Database Design Document

Version: 1.0

Author: Samuel Fombang

---

# Table of Contents

1. Database Overview
2. Design Principles
3. Core Collections
4. Collection Fields
5. Relationships
6. Indexes
7. Validation Rules
8. Stock Flow
9. Audit Fields
10. Future Expansion

---

# 1. Database Overview

BarMaster Cameroon uses MongoDB Atlas as its database.

The database stores information about:

- Users
- Roles
- Workers
- Categories
- Brands
- Suppliers
- Drinks
- Locations
- Inventory
- Stock Movements
- Purchases
- Purchase Items
- Transfers
- Transfer Items
- Sales
- Sale Items
- Expenses
- Shift Handovers
- Settings

The main purpose of the database is to track every drink from the supplier until it is sold to the customer.

---

# 2. Design Principles

The database design follows these principles:

1. Every drink must have a unique ID.

2. Every location must have a unique ID.

3. Inventory is stored by drink and location.

4. Every stock movement must be recorded.

5. Purchases increase stock at a warehouse location.

6. Transfers reduce stock at one location and increase stock at another.

7. Sales reduce stock at a sales location.

8. Important records must contain audit fields.

9. Sensitive records should not be permanently deleted without authorization.

10. The design must support future multiple warehouses and bars.

---

# 3. Core Collections

The final database will contain:

```text
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
```

---

# 4. Collection Fields

## 4.1 Roles

Stores user role definitions.

| Field | Type | Required | Description |
|---|---|---:|---|
| _id | ObjectId | Yes | Unique role ID |
| name | String | Yes | Manager, Storekeeper, Bartender |
| description | String | No | Role description |
| permissions | Array of String | Yes | Allowed actions |
| isActive | Boolean | Yes | Active status |
| createdAt | DateTime | Yes | Creation date |
| updatedAt | DateTime | Yes | Last update date |

---

## 4.2 Users

Stores application login accounts.

| Field | Type | Required | Description |
|---|---|---:|---|
| _id | ObjectId | Yes | Unique user ID |
| username | String | Yes | Login username |
| email | String | No | User email |
| passwordHash | String | Yes | Encrypted password |
| roleId | ObjectId | Yes | Related role |
| workerId | ObjectId | No | Related worker |
| isActive | Boolean | Yes | Account status |
| lastLoginAt | DateTime | No | Last login date |
| createdAt | DateTime | Yes | Creation date |
| updatedAt | DateTime | Yes | Last update date |

---

## 4.3 Workers

Stores employee information.

| Field | Type | Required | Description |
|---|---|---:|---|
| _id | ObjectId | Yes | Unique worker ID |
| fullName | String | Yes | Worker name |
| phone | String | No | Phone number |
| email | String | No | Email address |
| address | String | No | Home address |
| jobTitle | String | Yes | Manager, Storekeeper, Bartender |
| hireDate | DateTime | No | Employment date |
| isActive | Boolean | Yes | Worker status |
| createdAt | DateTime | Yes | Creation date |
| updatedAt | DateTime | Yes | Last update date |

---

## 4.4 Categories

Stores drink categories.

| Field | Type | Required | Description |
|---|---|---:|---|
| _id | ObjectId | Yes | Unique category ID |
| name | String | Yes | Category name |
| description | String | No | Category description |
| isActive | Boolean | Yes | Active status |
| createdAt | DateTime | Yes | Creation date |
| updatedAt | DateTime | Yes | Last update date |

Examples:

- Alcoholic Drinks
- Soft Drinks
- Water
- Energy Drinks
- Wine
- Spirits

---

## 4.5 Brands

Stores drink brands.

| Field | Type | Required | Description |
|---|---|---:|---|
| _id | ObjectId | Yes | Unique brand ID |
| name | String | Yes | Brand name |
| description | String | No | Brand description |
| isActive | Boolean | Yes | Active status |
| createdAt | DateTime | Yes | Creation date |
| updatedAt | DateTime | Yes | Last update date |

Examples:

- Guinness Cameroon
- Boissons du Cameroun
- UCB / Kadji
- Source du Pays

---

## 4.6 Suppliers

Stores supplier information.

| Field | Type | Required | Description |
|---|---|---:|---|
| _id | ObjectId | Yes | Unique supplier ID |
| name | String | Yes | Supplier name |
| contactPerson | String | No | Contact person |
| phone | String | No | Phone number |
| email | String | No | Email address |
| address | String | No | Supplier address |
| notes | String | No | Additional information |
| isActive | Boolean | Yes | Active status |
| createdAt | DateTime | Yes | Creation date |
| updatedAt | DateTime | Yes | Last update date |

---

## 4.7 Drinks

Stores all drinks sold by the business.

| Field | Type | Required | Description |
|---|---|---:|---|
| _id | ObjectId | Yes | Unique drink ID |
| name | String | Yes | Drink name |
| categoryId | ObjectId | Yes | Related category |
| brandId | ObjectId | Yes | Related brand |
| bottleSize | String | Yes | Bottle or can size |
| barcode | String | No | Barcode |
| buyingPrice | Decimal128 | Yes | Default buying price |
| sellingPrice | Decimal128 | Yes | Selling price |
| minimumStock | Int32 | Yes | General minimum stock |
| isActive | Boolean | Yes | Active status |
| createdAt | DateTime | Yes | Creation date |
| updatedAt | DateTime | Yes | Last update date |

Example:

```json
{
  "name": "Guinness",
  "categoryId": "ObjectId",
  "brandId": "ObjectId",
  "bottleSize": "65 cl",
  "buyingPrice": 650,
  "sellingPrice": 800,
  "minimumStock": 20,
  "isActive": true
}
```

---

## 4.8 Locations

Stores every physical stock location.

| Field | Type | Required | Description |
|---|---|---:|---|
| _id | ObjectId | Yes | Unique location ID |
| name | String | Yes | Location name |
| type | String | Yes | Warehouse or SalesArea |
| address | String | No | Location address |
| description | String | No | Location description |
| isActive | Boolean | Yes | Active status |
| createdAt | DateTime | Yes | Creation date |
| updatedAt | DateTime | Yes | Last update date |

Examples:

- Main Warehouse
- Main Bar
- VIP Bar
- Outdoor Bar

Allowed location types:

```text
Warehouse
SalesArea
DamagedStock
```

---

## 4.9 Inventory

Stores the current quantity of each drink at each location.

| Field | Type | Required | Description |
|---|---|---:|---|
| _id | ObjectId | Yes | Unique inventory record ID |
| drinkId | ObjectId | Yes | Related drink |
| locationId | ObjectId | Yes | Related location |
| quantity | Int32 | Yes | Current quantity |
| minimumQuantity | Int32 | Yes | Low stock level |
| isActive | Boolean | Yes | Active status |
| lastUpdatedAt | DateTime | Yes | Last update date |
| createdAt | DateTime | Yes | Creation date |
| updatedAt | DateTime | Yes | Last update date |

Business rule:

One drink can have only one inventory record per location.

Example:

| Drink | Location | Quantity |
|---|---|---:|
| Guinness | Main Warehouse | 500 |
| Guinness | Main Bar | 80 |
| Top | Main Warehouse | 300 |
| Top | Main Bar | 40 |

---

## 4.10 StockMovements

Stores the complete inventory history.

| Field | Type | Required | Description |
|---|---|---:|---|
| _id | ObjectId | Yes | Unique movement ID |
| movementNumber | String | Yes | Human-readable reference |
| drinkId | ObjectId | Yes | Related drink |
| movementType | String | Yes | Purchase, Transfer, Sale, etc. |
| quantity | Int32 | Yes | Quantity moved |
| sourceLocationId | ObjectId | No | Location stock came from |
| destinationLocationId | ObjectId | No | Location stock moved to |
| referenceType | String | No | Purchase, Transfer, Sale |
| referenceId | ObjectId | No | Related transaction ID |
| reason | String | No | Reason for adjustment |
| performedBy | ObjectId | Yes | User who performed action |
| movementDate | DateTime | Yes | Movement date |
| createdAt | DateTime | Yes | Creation date |

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

## 4.11 Purchases

Stores purchase headers.

| Field | Type | Required | Description |
|---|---|---:|---|
| _id | ObjectId | Yes | Unique purchase ID |
| purchaseNumber | String | Yes | Purchase reference |
| supplierId | ObjectId | Yes | Related supplier |
| destinationLocationId | ObjectId | Yes | Warehouse receiving stock |
| invoiceNumber | String | No | Supplier invoice |
| purchaseDate | DateTime | Yes | Purchase date |
| totalAmount | Decimal128 | Yes | Total purchase amount |
| paymentStatus | String | Yes | Paid, Partial, Unpaid |
| notes | String | No | Additional notes |
| status | String | Yes | Draft, Completed, Cancelled |
| createdBy | ObjectId | Yes | User who created purchase |
| createdAt | DateTime | Yes | Creation date |
| updatedAt | DateTime | Yes | Last update date |

---

## 4.12 PurchaseItems

Stores drinks inside a purchase.

| Field | Type | Required | Description |
|---|---|---:|---|
| _id | ObjectId | Yes | Unique item ID |
| purchaseId | ObjectId | Yes | Related purchase |
| drinkId | ObjectId | Yes | Related drink |
| quantity | Int32 | Yes | Quantity purchased |
| unitBuyingPrice | Decimal128 | Yes | Buying price per unit |
| lineTotal | Decimal128 | Yes | Quantity multiplied by price |
| createdAt | DateTime | Yes | Creation date |

---

## 4.13 Transfers

Stores transfer headers.

| Field | Type | Required | Description |
|---|---|---:|---|
| _id | ObjectId | Yes | Unique transfer ID |
| transferNumber | String | Yes | Transfer reference |
| sourceLocationId | ObjectId | Yes | Location stock comes from |
| destinationLocationId | ObjectId | Yes | Receiving location |
| transferDate | DateTime | Yes | Transfer date |
| issuedBy | ObjectId | Yes | User issuing stock |
| receivedBy | ObjectId | No | Worker receiving stock |
| reason | String | No | Transfer reason |
| status | String | Yes | Pending, Completed, Cancelled |
| createdAt | DateTime | Yes | Creation date |
| updatedAt | DateTime | Yes | Last update date |

---

## 4.14 TransferItems

Stores drinks inside a transfer.

| Field | Type | Required | Description |
|---|---|---:|---|
| _id | ObjectId | Yes | Unique item ID |
| transferId | ObjectId | Yes | Related transfer |
| drinkId | ObjectId | Yes | Related drink |
| quantity | Int32 | Yes | Quantity transferred |
| createdAt | DateTime | Yes | Creation date |

---

## 4.15 Sales

Stores sales headers.

| Field | Type | Required | Description |
|---|---|---:|---|
| _id | ObjectId | Yes | Unique sale ID |
| saleNumber | String | Yes | Sale reference |
| locationId | ObjectId | Yes | Bar where sale occurred |
| shiftId | ObjectId | No | Related shift |
| saleDate | DateTime | Yes | Sale date |
| subtotal | Decimal128 | Yes | Amount before discount |
| discount | Decimal128 | Yes | Discount amount |
| totalAmount | Decimal128 | Yes | Final amount |
| paymentMethod | String | Yes | Cash, MTN MoMo, Orange Money |
| paymentStatus | String | Yes | Paid, Partial, Credit |
| customerName | String | No | Customer name |
| createdBy | ObjectId | Yes | Bartender or user |
| status | String | Yes | Completed, Cancelled |
| createdAt | DateTime | Yes | Creation date |
| updatedAt | DateTime | Yes | Last update date |

Allowed payment methods:

```text
Cash
MTN_MOMO
ORANGE_MONEY
CARD
CREDIT
```

---

## 4.16 SaleItems

Stores drinks inside a sale.

| Field | Type | Required | Description |
|---|---|---:|---|
| _id | ObjectId | Yes | Unique item ID |
| saleId | ObjectId | Yes | Related sale |
| drinkId | ObjectId | Yes | Related drink |
| quantity | Int32 | Yes | Quantity sold |
| unitSellingPrice | Decimal128 | Yes | Selling price |
| unitBuyingPrice | Decimal128 | Yes | Cost price at time of sale |
| lineTotal | Decimal128 | Yes | Quantity multiplied by selling price |
| lineProfit | Decimal128 | Yes | Sales amount minus cost |
| createdAt | DateTime | Yes | Creation date |

---

## 4.17 Expenses

Stores business expenses.

| Field | Type | Required | Description |
|---|---|---:|---|
| _id | ObjectId | Yes | Unique expense ID |
| expenseNumber | String | Yes | Expense reference |
| category | String | Yes | Electricity, Transport, Salary |
| description | String | Yes | Expense details |
| amount | Decimal128 | Yes | Expense amount |
| expenseDate | DateTime | Yes | Expense date |
| paymentMethod | String | Yes | Cash, MTN MoMo, etc. |
| createdBy | ObjectId | Yes | User recording expense |
| createdAt | DateTime | Yes | Creation date |
| updatedAt | DateTime | Yes | Last update date |

---

## 4.18 ShiftHandovers

Stores worker shift information.

| Field | Type | Required | Description |
|---|---|---:|---|
| _id | ObjectId | Yes | Unique shift ID |
| shiftNumber | String | Yes | Shift reference |
| locationId | ObjectId | Yes | Bar location |
| outgoingWorkerId | ObjectId | Yes | Worker closing shift |
| incomingWorkerId | ObjectId | No | Worker receiving shift |
| openingDateTime | DateTime | Yes | Shift start |
| closingDateTime | DateTime | No | Shift end |
| expectedCash | Decimal128 | Yes | Expected cash |
| actualCash | Decimal128 | No | Cash counted |
| cashDifference | Decimal128 | No | Actual minus expected |
| stockDifference | Int32 | No | Total stock difference |
| notes | String | No | Shift notes |
| status | String | Yes | Open, Closed, HandedOver |
| approvedBy | ObjectId | No | Manager approval |
| createdAt | DateTime | Yes | Creation date |
| updatedAt | DateTime | Yes | Last update date |

---

## 4.19 Settings

Stores business settings.

| Field | Type | Required | Description |
|---|---|---:|---|
| _id | ObjectId | Yes | Unique settings ID |
| businessName | String | Yes | Business name |
| address | String | No | Business address |
| phone | String | No | Business phone |
| email | String | No | Business email |
| currency | String | Yes | FCFA |
| receiptFooter | String | No | Receipt message |
| lowStockNotifications | Boolean | Yes | Enable alerts |
| createdAt | DateTime | Yes | Creation date |
| updatedAt | DateTime | Yes | Last update date |

---

# 5. Relationships

Main relationships:

```text
Role
  └── Users

Worker
  └── User

Category
  └── Drinks

Brand
  └── Drinks

Supplier
  └── Purchases

Location
  ├── Inventory
  ├── Purchases
  ├── Transfers
  ├── Sales
  └── ShiftHandovers

Drink
  ├── Inventory
  ├── StockMovements
  ├── PurchaseItems
  ├── TransferItems
  └── SaleItems
```

MongoDB does not enforce foreign keys automatically.

The backend service layer must validate referenced IDs before saving records.

---

# 6. Indexes

Recommended unique indexes:

## Roles

```text
name
```

## Users

```text
username
email
```

## Categories

```text
name
```

## Brands

```text
name
```

## Suppliers

```text
name
```

## Locations

```text
name
```

## Drinks

Recommended compound unique index:

```text
name + brandId + bottleSize
```

## Inventory

Required compound unique index:

```text
drinkId + locationId
```

## StockMovements

```text
movementNumber
movementDate
drinkId
```

## Purchases

```text
purchaseNumber
invoiceNumber
purchaseDate
supplierId
```

## Transfers

```text
transferNumber
transferDate
```

## Sales

```text
saleNumber
saleDate
locationId
```

---

# 7. Validation Rules

1. Quantities cannot be negative.

2. Buying and selling prices cannot be negative.

3. Selling price should normally be greater than or equal to buying price.

4. A transfer cannot use the same source and destination location.

5. A transfer cannot exceed available source inventory.

6. A sale cannot exceed available bar inventory.

7. A purchase must have at least one purchase item.

8. A transfer must have at least one transfer item.

9. A sale must have at least one sale item.

10. Completed transactions cannot be edited without manager approval.

11. Cancelled transactions must record the user and reason.

12. Duplicate inventory records for the same drink and location are not allowed.

---

# 8. Stock Flow

## Purchase

```text
Supplier
    ↓
Warehouse Location
```

Actions:

1. Create Purchase.
2. Create Purchase Items.
3. Increase warehouse Inventory.
4. Create PURCHASE StockMovement records.

---

## Transfer

```text
Warehouse Location
    ↓
Bar Location
```

Actions:

1. Verify source stock.
2. Reduce source Inventory.
3. Increase destination Inventory.
4. Create TRANSFER StockMovement records.

---

## Sale

```text
Bar Location
    ↓
Customer
```

Actions:

1. Verify bar stock.
2. Create Sale.
3. Create Sale Items.
4. Reduce bar Inventory.
5. Create SALE StockMovement records.
6. Calculate profit.

---

## Return

```text
Bar Location
    ↓
Warehouse Location
```

Actions:

1. Reduce bar Inventory.
2. Increase warehouse Inventory.
3. Create RETURN StockMovement records.

---

## Damage

```text
Warehouse or Bar
    ↓
Damaged Stock
```

Actions:

1. Reduce source Inventory.
2. Optionally increase Damaged Stock location.
3. Create DAMAGE StockMovement records.
4. Record reason and user.

---

# 9. Audit Fields

Important collections should contain:

```text
createdBy
createdAt
updatedBy
updatedAt
```

Sensitive cancellations should contain:

```text
cancelledBy
cancelledAt
cancellationReason
```

Soft deletion may use:

```text
isDeleted
deletedBy
deletedAt
deleteReason
```

This allows the manager to see who performed every important action.

---

# 10. Future Expansion

The database design supports:

- Multiple warehouses
- Multiple bars
- Multiple business branches
- Barcode scanning
- Mobile applications
- Offline synchronization
- Customer debts
- Supplier payments
- Purchase returns
- Sales returns
- Tax support
- Multi-currency support
- Advanced analytics

---

End of Document
# BarMaster Cameroon

# UI/UX Design Document

Version: 1.0

Author: Samuel Fombang

---

# Table of Contents

1. Design Goals
2. User Roles
3. Main Navigation
4. Layout Structure
5. Dashboard
6. Master Data Pages
7. Locations Page
8. Inventory Page
9. Stock Movements Page
10. Purchases Page
11. Transfers Page
12. Sales Page
13. Workers Page
14. Shift Management
15. Expenses Page
16. Reports
17. Settings
18. Forms and Dialogs
19. Status Colours
20. Responsive Design
21. Accessibility
22. Future UI Enhancements

---

# 1. Design Goals

BarMaster Cameroon should be:

- Simple to understand
- Fast to use
- Professional
- Mobile-friendly
- Easy for workers with limited technical experience
- Consistent across all modules
- Suitable for daily use in a real bar

The interface should avoid technical terms such as MongoDB IDs.

Users should select drinks, suppliers, workers and locations by name.

---

# 2. User Roles

The interface changes according to the logged-in user.

## Manager

Can access:

- Dashboard
- Drinks
- Categories
- Brands
- Suppliers
- Workers
- Locations
- Inventory
- Stock Movements
- Purchases
- Transfers
- Sales
- Expenses
- Shifts
- Reports
- Settings

## Storekeeper

Can access:

- Dashboard
- Drinks
- Suppliers
- Locations
- Inventory
- Purchases
- Transfers
- Stock Movements

## Bartender

Can access:

- Dashboard
- Bar Inventory
- Sales
- Shift Opening
- Shift Closing
- Shift Handover
- Stock Requests

---

# 3. Main Navigation

The sidebar should be grouped into sections.

```text
Dashboard

Master Data
    Drinks
    Categories
    Brands
    Suppliers
    Workers

Inventory
    Locations
    Inventory
    Stock Movements
    Transfers

Operations
    Purchases
    Sales
    Expenses

Shift Management
    Open Shift
    Close Shift
    Handover

Reports
    Daily
    Weekly
    Monthly
    Profit
    Low Stock
    Worker Performance

Administration
    Users
    Roles
    Settings
```

The currently selected page should be highlighted.

---

# 4. Layout Structure

The application uses a main layout.

```text
---------------------------------------------------------
| Sidebar | Header                                     |
|         |---------------------------------------------|
|         | Page Title                                  |
|         | Page Description                            |
|         |                                             |
|         | Main Page Content                           |
|         |                                             |
---------------------------------------------------------
```

## Sidebar

Contains:

- BarMaster logo
- Business name
- Navigation links
- Version number

## Header

Contains:

- Current page name
- Logged-in user
- User role
- Notification icon
- Logout button

## Content Area

Contains:

- Summary cards
- Tables
- Search
- Filters
- Action buttons
- Dialogs

---

# 5. Dashboard

The Dashboard gives the manager a quick business summary.

## Summary Cards

```text
Today's Sales
Today's Profit
Warehouse Stock Value
Bar Stock Value
Low Stock Items
Out of Stock Items
Today's Purchases
Today's Transfers
Workers on Duty
```

## Dashboard Sections

### Recent Sales

Columns:

- Sale Number
- Time
- Worker
- Payment Method
- Total

### Recent Purchases

Columns:

- Purchase Number
- Supplier
- Date
- Total
- Status

### Recent Transfers

Columns:

- Transfer Number
- From
- To
- Date
- Status

### Low Stock Items

Columns:

- Drink
- Location
- Current Quantity
- Minimum Quantity
- Status

### Dashboard Charts

Future charts:

- Daily sales trend
- Monthly profit trend
- Best-selling drinks
- Payment method breakdown

---

# 6. Master Data Pages

The following pages use a similar layout:

- Drinks
- Categories
- Brands
- Suppliers
- Workers

## Standard Page Layout

```text
Page Title

Page Description

Search Field                    Add Button

Data Table
```

## Common Features

- Search
- Add
- Edit
- Delete
- Active or Inactive status
- Pagination
- Confirmation dialog
- Success and error messages

---

## 6.1 Categories Page

Columns:

- Category Name
- Description
- Status
- Actions

Buttons:

- Add Category
- Edit
- Delete

---

## 6.2 Brands Page

Columns:

- Brand Name
- Description
- Status
- Actions

Buttons:

- Add Brand
- Edit
- Delete

---

## 6.3 Suppliers Page

Columns:

- Supplier Name
- Contact Person
- Phone
- Email
- Address
- Status
- Actions

Buttons:

- Add Supplier
- Edit
- Delete

---

## 6.4 Workers Page

Columns:

- Worker Name
- Phone
- Job Title
- Hire Date
- Status
- Actions

Buttons:

- Add Worker
- Edit
- Deactivate

---

## 6.5 Drinks Page

Summary cards:

- Total Drinks
- Active Drinks
- Low Stock Drinks
- Total Inventory Value

Columns:

- Drink Name
- Category
- Brand
- Bottle Size
- Buying Price
- Selling Price
- Status
- Actions

Add Drink Form:

- Drink Name
- Category Dropdown
- Brand Dropdown
- Bottle Size
- Barcode
- Buying Price
- Selling Price
- Minimum Stock
- Active Status

The user must never type category or brand IDs.

---

# 7. Locations Page

The Locations page manages warehouses and sales areas.

## Summary Cards

- Total Locations
- Warehouses
- Sales Areas
- Inactive Locations

## Columns

- Location Name
- Type
- Address
- Description
- Status
- Actions

## Add Location Form

Fields:

- Location Name
- Location Type
- Address
- Description
- Active Status

Allowed types:

```text
Warehouse
Sales Area
Damaged Stock
```

Examples:

- Main Warehouse
- Main Bar
- VIP Bar
- Damaged Stock Area

---

# 8. Inventory Page

The Inventory page shows stock by drink and location.

## Summary Cards

- Total Bottles
- Inventory Value
- Low Stock Items
- Out of Stock Items

## Filters

- Search Drink
- Location
- Category
- Brand
- Stock Status

## Columns

- Drink
- Brand
- Bottle Size
- Location
- Quantity
- Minimum Quantity
- Stock Status
- Last Updated
- Actions

## Stock Status

```text
Available
Low Stock
Out of Stock
Inactive
```

## Actions

- View History
- Change Minimum Level
- Create Adjustment

Users should not directly change quantity without a stock movement.

---

# 9. Stock Movements Page

This page provides the complete stock history.

## Filters

- Date Range
- Drink
- Location
- Movement Type
- User
- Reference Number

## Columns

- Movement Number
- Date and Time
- Drink
- Type
- Quantity
- From
- To
- Reference
- Performed By
- Reason

## Movement Types

```text
Purchase
Transfer
Sale
Return
Damage
Adjustment In
Adjustment Out
Opening Balance
```

Movement records should not normally be deleted.

---

# 10. Purchases Page

The Purchases page records drinks received from suppliers.

## Summary Cards

- Purchases Today
- Purchase Value Today
- Unpaid Purchases
- Recent Supplier

## Filters

- Search Purchase Number
- Supplier
- Payment Status
- Purchase Status
- Date Range

## Columns

- Purchase Number
- Supplier
- Warehouse
- Invoice Number
- Purchase Date
- Total Amount
- Payment Status
- Status
- Actions

## Add Purchase Form

Header fields:

- Supplier Dropdown
- Destination Warehouse
- Invoice Number
- Purchase Date
- Payment Status
- Notes

Items table:

- Drink Dropdown
- Quantity
- Unit Buying Price
- Line Total
- Remove Item

Buttons:

- Add Item
- Save Draft
- Complete Purchase
- Cancel

On completion:

- Warehouse inventory increases
- Purchase stock movements are created

---

# 11. Transfers Page

The Transfers page moves stock between locations.

## Summary Cards

- Transfers Today
- Bottles Transferred Today
- Pending Transfers
- Completed Transfers

## Filters

- Search Transfer Number
- Source Location
- Destination Location
- Status
- Date Range

## Columns

- Transfer Number
- From
- To
- Date
- Issued By
- Received By
- Status
- Actions

## Add Transfer Form

Header fields:

- Source Location
- Destination Location
- Transfer Date
- Received By
- Reason

Items table:

- Drink
- Available Quantity
- Transfer Quantity
- Remove Item

Buttons:

- Add Item
- Save
- Complete Transfer
- Cancel

Validation:

- Source and destination cannot be the same
- Transfer quantity cannot exceed source stock

---

# 12. Sales Page

The Sales page functions as the Point of Sale.

## POS Layout

```text
---------------------------------------------------------
| Drink Search / Drink Grid | Current Sale              |
|                           |                           |
| Drink Buttons             | Selected Items            |
|                           | Quantity                  |
|                           | Price                     |
|                           | Total                     |
|                           | Payment Method            |
|                           | Complete Sale             |
---------------------------------------------------------
```

## Drink Selection

Users can find drinks by:

- Search
- Category
- Brand
- Barcode
- Favourite Drinks

## Current Sale

Columns:

- Drink
- Quantity
- Unit Price
- Total
- Remove

## Sale Summary

- Subtotal
- Discount
- Total Amount
- Amount Received
- Change

## Payment Methods

```text
Cash
MTN Mobile Money
Orange Money
Card
Credit
```

Buttons:

- Complete Sale
- Clear Sale
- Hold Sale
- Print Receipt

Sales must only use inventory from a Sales Area location.

---

# 13. Workers Page

The Workers page manages employees.

## Columns

- Full Name
- Phone
- Email
- Job Title
- Hire Date
- Status
- Actions

## Worker Form

- Full Name
- Phone
- Email
- Address
- Job Title
- Hire Date
- Active Status

Job titles:

```text
Manager
Storekeeper
Bartender
Cashier
Cleaner
Security
Other
```

---

# 14. Shift Management

## 14.1 Open Shift

Fields:

- Worker
- Bar Location
- Opening Date and Time
- Opening Cash
- Notes

Button:

- Open Shift

## 14.2 Active Shift

Shows:

- Worker
- Location
- Opening Time
- Opening Cash
- Sales Total
- Cash Sales
- Mobile Money Sales
- Credit Sales
- Stock Received

## 14.3 Close Shift

Fields:

- Expected Cash
- Actual Cash
- Cash Difference
- Expected Stock
- Physical Stock
- Stock Difference
- Notes

Buttons:

- Save Count
- Close Shift
- Request Manager Approval

## 14.4 Handover

Fields:

- Outgoing Worker
- Incoming Worker
- Location
- Cash Difference
- Stock Difference
- Notes
- Outgoing Worker Confirmation
- Incoming Worker Confirmation
- Manager Approval

---

# 15. Expenses Page

## Summary Cards

- Expenses Today
- Expenses This Month
- Highest Expense Category
- Number of Expenses

## Filters

- Date Range
- Category
- Payment Method
- User

## Columns

- Expense Number
- Date
- Category
- Description
- Amount
- Payment Method
- Recorded By
- Actions

## Add Expense Form

- Category
- Description
- Amount
- Expense Date
- Payment Method
- Receipt Reference
- Notes

---

# 16. Reports

The Reports section should use filters and export buttons.

## Common Filters

- Start Date
- End Date
- Location
- Worker
- Supplier
- Drink
- Category

## Common Actions

- Apply Filters
- Reset Filters
- Print
- Export to Excel
- Export to PDF

## Report Pages

### Daily Sales

Shows:

- Total Sales
- Total Profit
- Items Sold
- Payment Breakdown
- Sales by Worker

### Weekly Sales

Shows:

- Daily totals
- Weekly total
- Weekly profit
- Best-selling drinks

### Monthly Sales

Shows:

- Monthly sales
- Monthly profit
- Expense total
- Net profit
- Sales trend

### Inventory Report

Shows:

- Drink
- Location
- Quantity
- Minimum Quantity
- Stock Value
- Status

### Low Stock Report

Shows:

- Drink
- Location
- Current Quantity
- Minimum Quantity
- Recommended Reorder Quantity

### Purchase Report

Shows:

- Supplier
- Purchase Number
- Date
- Amount
- Payment Status

### Transfer Report

Shows:

- Transfer Number
- From
- To
- Quantity
- Date
- User

### Worker Performance

Shows:

- Worker
- Total Sales
- Number of Shifts
- Cash Differences
- Stock Differences

---

# 17. Settings

## Business Information

Fields:

- Business Name
- Address
- Phone
- Email
- Logo

## Financial Settings

- Currency
- Default Payment Method
- Allow Credit Sales
- Allow Discounts

## Inventory Settings

- Enable Low Stock Alerts
- Allow Negative Stock
- Require Manager Approval for Adjustments
- Default Warehouse
- Default Bar

## Receipt Settings

- Receipt Header
- Receipt Footer
- Show Business Phone
- Show Worker Name

## Security Settings

- Session Timeout
- Password Rules
- Manager Approval Requirements

---

# 18. Forms and Dialogs

All forms should follow these rules:

1. Required fields are clearly marked.

2. Validation messages appear below the field.

3. Save buttons are disabled while saving.

4. Cancel buttons close the dialog safely.

5. Delete actions require confirmation.

6. Sensitive actions require a reason.

7. IDs are never typed manually by users.

8. Dropdowns show readable names.

9. Success messages use Snackbars.

10. Server errors use clear messages.

---

# 19. Status Colours

Use consistent status colours.

```text
Green
Active
Available
Completed
Paid
Success

Yellow
Low Stock
Pending
Partial Payment
Warning

Red
Out of Stock
Cancelled
Unpaid
Error
Shortage

Grey
Inactive
Draft
Unknown

Blue
Information
Transfer
Processing
```

Colours must not be the only method used to communicate status.

Every status should also include text.

---

# 20. Responsive Design

## Desktop

- Permanent sidebar
- Full-width tables
- Multiple summary cards per row

## Tablet

- Collapsible sidebar
- Horizontal table scrolling
- Two summary cards per row

## Mobile

- Drawer navigation
- One summary card per row
- Simplified tables
- Larger touch buttons
- POS optimized for touch

---

# 21. Accessibility

The interface should:

- Use readable font sizes
- Maintain sufficient colour contrast
- Support keyboard navigation
- Use labels for every field
- Include clear button text
- Avoid using colour alone
- Show helpful validation messages
- Support screen readers where possible

---

# 22. Future UI Enhancements

Future versions may include:

- Dark mode
- Mobile application
- Barcode scanner
- QR code scanner
- Product images
- Dashboard charts
- Notification centre
- Offline sales mode
- Multi-language support
- French language
- Printable receipts
- Touch-screen POS mode
- Custom dashboard widgets

---

End of Document
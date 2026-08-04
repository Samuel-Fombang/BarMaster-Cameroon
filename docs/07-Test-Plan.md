# BarMaster Cameroon

# Test Plan

Version: 1.0

Author: Samuel Fombang

---

# Table of Contents

1. Introduction
2. Testing Objectives
3. Testing Types
4. Test Environment
5. Module Test Cases
6. Acceptance Criteria
7. Bug Reporting
8. Deployment Checklist

---

# 1. Introduction

This document defines how BarMaster Cameroon will be tested before release.

The goal is to ensure the application is reliable, accurate, secure and easy to use.

---

# 2. Testing Objectives

The system must:

- Work correctly
- Prevent invalid data
- Protect business data
- Calculate stock correctly
- Calculate profit correctly
- Handle errors gracefully
- Be easy to use

---

# 3. Testing Types

## Unit Testing

Tests individual methods.

Examples:

- Profit calculation
- Stock calculation
- Validation rules

---

## API Testing

Verify:

GET

POST

PUT

DELETE

Return correct results.

---

## Frontend Testing

Verify:

Pages load correctly

Forms validate correctly

Dialogs open correctly

Tables display data correctly

Search works correctly

---

## Integration Testing

Verify:

Frontend communicates correctly with backend.

Backend communicates correctly with MongoDB.

Inventory updates correctly.

---

## User Acceptance Testing

Manager verifies:

Inventory

Purchases

Sales

Reports

Expenses

Workers

---

# 4. Test Environment

Frontend

React

Backend

ASP.NET Core Web API

Database

MongoDB Atlas

Browser

Google Chrome

Microsoft Edge

Firefox

---

# 5. Module Test Cases

## Categories

✓ Add

✓ Edit

✓ Delete

✓ Search

---

## Brands

✓ Add

✓ Edit

✓ Delete

✓ Search

---

## Suppliers

✓ Add

✓ Edit

✓ Delete

✓ Search

---

## Drinks

✓ Add

✓ Edit

✓ Delete

✓ Search

✓ Duplicate validation

---

## Locations

✓ Warehouse

✓ Sales Area

✓ Validation

---

## Inventory

✓ Opening Balance

✓ Minimum Level

✓ Low Stock

✓ Out Of Stock

---

## Purchases

✓ Receive drinks

✓ Increase inventory

✓ Save purchase

---

## Transfers

✓ Warehouse decreases

✓ Bar increases

✓ Reject insufficient stock

---

## Sales

✓ Reduce inventory

✓ Calculate total

✓ Calculate profit

✓ Payment methods

---

## Expenses

✓ Add

✓ Edit

✓ Delete

✓ Reports

---

## Reports

✓ Daily

✓ Weekly

✓ Monthly

✓ Profit

✓ Inventory

---

# 6. Acceptance Criteria

The system passes when:

✓ All modules work.

✓ No critical errors exist.

✓ Inventory remains correct.

✓ Reports are accurate.

✓ Users can log in.

✓ Permissions work correctly.

---

# 7. Bug Reporting

Every bug should record:

Bug ID

Description

Steps to reproduce

Expected result

Actual result

Priority

Status

Assigned developer

Resolution date

---

# 8. Deployment Checklist

Before release:

✓ Build backend

✓ Build frontend

✓ Database backup

✓ Environment variables

✓ API testing

✓ Frontend testing

✓ User testing

✓ Documentation complete

✓ GitHub updated

✓ Release created

---

End of Document
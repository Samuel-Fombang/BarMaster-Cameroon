# BarMaster Cameroon

# Software Requirements Specification (SRS)

Version: 1.0

Author: Samuel Fombang

---

# Table of Contents

1. Introduction
2. Project Overview
3. Objectives
4. Scope
5. User Roles
6. Functional Requirements
7. Non-Functional Requirements
8. Business Rules
9. Technology Stack
10. Future Enhancements

---

# 1. Introduction

BarMaster Cameroon is a professional Bar Management System developed to help bar owners manage inventory, purchases, sales, workers, expenses and reports.

The system is designed for bars, snack bars, lounges and restaurants operating in Cameroon.

---

# 2. Project Overview

The system will manage the complete movement of drinks from suppliers until they are sold to customers.

Stock movement:

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

The system will automatically update inventory after every transaction.

---

# 3. Objectives

The objectives of BarMaster Cameroon are:

• Reduce stock losses

• Improve inventory control

• Monitor worker activities

• Track purchases

• Track sales

• Generate business reports

• Calculate profit automatically

• Improve business decision making

---

# 4. Scope

The system shall manage:

• Drinks

• Categories

• Brands

• Suppliers

• Workers

• Warehouse Inventory

• Bar Inventory

• Stock Transfers

• Purchases

• Sales

• Expenses

• Shift Handovers

• Reports

• Users

• Roles and Permissions

---

# 5. User Roles

## Manager

The manager can:

• Manage all modules

• View reports

• Approve transfers

• Approve stock adjustments

• Manage workers

• Manage settings

---

## Storekeeper

The storekeeper can:

• Receive purchases

• Manage warehouse stock

• Transfer stock to the bar

• View warehouse reports

---

## Bartender

The bartender can:

• View bar stock

• Record sales

• Request additional drinks

• Close shift

• Perform shift handover

---

# 6. Functional Requirements

The system shall:

FR-001

Allow user login.

FR-002

Manage drinks.

FR-003

Manage categories.

FR-004

Manage brands.

FR-005

Manage suppliers.

FR-006

Manage workers.

FR-007

Record purchases.

FR-008

Increase warehouse inventory after purchase.

FR-009

Transfer drinks from warehouse to bar.

FR-010

Decrease warehouse stock after transfer.

FR-011

Increase bar stock after transfer.

FR-012

Record sales.

FR-013

Reduce bar stock after sales.

FR-014

Record expenses.

FR-015

Generate reports.

FR-016

Record stock movements.

FR-017

Manage shift handovers.

FR-018

Calculate daily profit.

FR-019

Calculate monthly profit.

FR-020

Alert low stock.

---

# 7. Non-Functional Requirements

The system should:

• Be easy to use.

• Be responsive.

• Be secure.

• Be scalable.

• Have fast performance.

• Maintain data integrity.

• Keep audit logs.

• Support future expansion.

---

# 8. Business Rules

1. Purchases only increase warehouse stock.

2. Sales only reduce bar stock.

3. Every transfer must reduce warehouse stock.

4. Every transfer must increase bar stock.

5. Every stock movement must be recorded.

6. Workers must complete shift handover.

7. Managers approve sensitive actions.

8. Every transaction records the user who performed it.

---

# 9. Technology Stack

Frontend

• React

• TypeScript

• Material UI

Backend

• C#

• ASP.NET Core Web API

Database

• MongoDB Atlas

Version Control

• GitHub

---

# 10. Future Enhancements

Future versions may include:

• Barcode scanner

• QR Code support

• Mobile application

• Multi-branch support

• SMS notifications

• WhatsApp notifications

• Cloud backup

• AI sales prediction

---

End of Document
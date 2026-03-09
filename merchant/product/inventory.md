---
subtitle: Track and manage product stock levels across warehouses.
---
# Inventory

Meloncart includes a warehouse-based inventory system that tracks stock levels across multiple locations, prevents overselling through stock reservations, and sends low-stock notifications. Inventory tracking is optional and can be configured per product.

## Enabling Inventory Tracking

Inventory tracking is available when the product type has the **Has Inventory** feature enabled. On the product form, check the **Track Inventory** checkbox to activate stock management for that product.

Once enabled, the Inventory tab shows the warehouse stock table and the following settings:

- **Hidden When Out Of Stock** — Automatically hides the product from the storefront when it goes out of stock.
- **Allow Negative Stock** — Allows the stock count to go below zero, useful for accepting orders beyond current inventory.
- **Out Of Stock Threshold** — An optional stock level that triggers a low-stock notification. When salable stock falls to or below this number, store managers are notified by email.
- **Allow Pre-Order** — Allows customers to purchase the product even when it is out of stock.

## Warehouses

Warehouses represent physical locations where inventory is stored — such as fulfillment centers, retail stores, or third-party logistics providers. Manage warehouses under **Shop → Warehouses** in the backend.

### Creating a Warehouse

Each warehouse has the following fields:

- **Name** — A descriptive name (e.g., "Buho Logistics Mexico").
- **Code** — A unique identifier (e.g., `mx-buho`).
- **Enabled** — Whether the warehouse is active for fulfillment.
- **Description** — Optional internal notes about the warehouse.
- **Sites** — Which storefronts this warehouse fulfills orders for (see below).
- **Address** — The warehouse's physical address (address, city, postal code, country, state).
- **Contact** — Contact person details (name, email, phone).

### Assigning Warehouses to Sites

Each warehouse can be assigned to one or more sites. This controls which warehouses are used to calculate available stock for customers visiting a particular storefront.

For example, a multi-country store might have:

| Warehouse | Assigned Sites | Priority |
|-----------|---------------|----------|
| Buho Logistics Mexico | Mexico (ES), Mexico (EN) | 1 |
| Bogota Warehouse | Colombia (ES) | 1 |
| Buho Logistics Mexico | Colombia (ES) | 2 (backup) |

When multiple warehouses serve the same site, stock from all assigned warehouses is combined. The **priority** on each assignment determines which warehouse is drawn from first when fulfilling orders — lower priority numbers are used first.

::: tip
If you operate a single warehouse, simply create one warehouse and assign it to all your sites. The system will work identically to a single-location inventory.
:::

## Managing Stock

Stock is managed on the product form in the **Inventory** tab. When inventory tracking is enabled and warehouses exist, the tab displays a stock table showing each warehouse with its quantity, reserved units, and salable amount.

Click **Add Stock** to add inventory for a warehouse:

- **Warehouse** — Select the warehouse where this stock is held.
- **Quantity** — The number of physical units on hand at this warehouse.
- **Reserved** — Units held by pending orders (managed automatically by the system).

The **salable quantity** shown to customers on the storefront is calculated as:

```
Salable = Quantity − Reserved
```

This is summed across all enabled warehouses assigned to the customer's site.

## Per-Variant Stock Tracking

When a product uses [variants](./variants), each variant tracks its own stock per warehouse independently. Set the stock for each variant in the variant's **Inventory** tab.

When a variant-specific combination is purchased, only that variant's stock is affected — other variants and the product-level stock remain unchanged.

## Stock and Order Lifecycle

Stock changes follow a two-phase reservation lifecycle tied to order statuses:

### 1. Order Placed (New)

When a customer places an order, stock is **reserved** for all items in the order. The physical quantity stays the same, but the reserved count increases — reducing the salable quantity visible to other customers. This prevents overselling when multiple customers are shopping simultaneously.

### 2. Order Shipped

When the order status changes to **Shipped**, the physical stock is **decreased** and the reservation is **released**. At this point, the units have left the warehouse.

### 3. Order Cancelled

If an order is cancelled before shipment, the reservation is **released** without changing the physical stock. The salable quantity is restored, making those units available for other customers.

### 4. Order Refunded

If an order is refunded after shipment, no automatic stock adjustment occurs — the units have already left the warehouse. If the items are physically returned, you can manually increase the stock on the product form.

::: info
The order status flow for inventory is: **New** (reserve) → **Paid** (no stock action) → **Shipped** (decrease) or **Cancelled** (release). The **Paid** status is a billing milestone and does not affect stock.
:::

### Priority-Based Fulfillment

When multiple warehouses serve the same site, stock operations follow the warehouse priority order. If the highest-priority warehouse has insufficient stock, the remainder spills to the next warehouse. For example:

| Warehouse | Priority | Quantity | Reserved |
|-----------|----------|----------|----------|
| Primary Warehouse | 1 | 10 | 0 |
| Backup Warehouse | 2 | 50 | 0 |

If a customer orders 15 units, the system reserves 10 from Primary Warehouse and 5 from Backup Warehouse.

## Low-Stock Notifications

When a product goes out of stock (or falls below its stock alert threshold), Meloncart sends an email notification to all backend users in the **store-managers** admin group.

To receive low-stock notifications:

1. Create a backend user group with the code `store-managers` under **Settings → Administrators → Groups** (if it does not already exist).
2. Add the backend users who should receive notifications to this group.

::: info
The low-stock email template can be customized under **Settings → Mail Templates** by editing the `shop:low_stock_internal` template.
:::

## Out-of-Stock Behavior

A product is considered out of stock when its total salable quantity across all warehouses for the current site reaches zero (or falls to or below the **Out Of Stock Threshold**, if one is set).

Out-of-stock behavior depends on the product's settings:

- **Hidden When Out Of Stock** — The product is automatically hidden from the storefront when it goes out of stock.
- **Allow Pre-Order** — Customers can still purchase the product even when it is out of stock. This is useful for upcoming products or items with a known restock date.
- **Allow Negative Stock** — The stock count can go below zero, allowing orders to be accepted beyond current inventory.

::: tip
If none of these options are enabled and a product goes out of stock, it remains visible on the storefront but cannot be added to the cart.
:::

## Products Without Inventory Tracking

When the **Track Inventory** checkbox is not enabled, the product is treated as always in stock. No stock fields are shown, no stock decreases occur on purchase, and no low-stock notifications are sent. This is appropriate for digital products, services, or items with unlimited availability.

## Multi-Store Inventory

Warehouses use the same [multi-store](../settings/multi-store) site group scoping as other shop data. Each site group (store) has its own set of warehouses. Within a store, warehouses are assigned to specific sites to control which locations fulfill for which storefronts.

This enables scenarios like:

- **Country-specific fulfillment** — A Mexico warehouse serves the Mexico site, a Colombia warehouse serves the Colombia site.
- **Shared warehouses** — A central warehouse serves multiple regional sites, with the same stock visible to all.
- **Backup fulfillment** — A primary warehouse is preferred, with a secondary warehouse as overflow.

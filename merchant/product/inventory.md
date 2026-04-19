---
subtitle: Track and manage product stock levels.
---
# Inventory

Meloncart includes an inventory system that tracks stock levels, prevents overselling through stock reservations, and sends low-stock notifications. Inventory tracking is optional and can be configured per product.

## Enabling Inventory Tracking

Inventory tracking is available when the product type has the **Has Inventory** feature enabled. On the product form, check the **Track Inventory** checkbox to activate stock management for that product.

Once enabled, the Inventory tab shows the **Units in Stock** field and the following settings:

- **Hidden When Out Of Stock**: Automatically hides the product from the storefront when it goes out of stock.
- **Allow Negative Stock**: Allows the stock count to go below zero, useful for accepting orders beyond current inventory.
- **Out Of Stock Threshold**: An optional stock level that triggers a low-stock notification. When salable stock falls to or below this number, store managers are notified by email.
- **Allow Pre-Order**: Allows customers to purchase the product even when it is out of stock.

## Managing Stock

Set the **Units in Stock** value on the product form in the **Inventory** tab. This represents the physical units on hand.

The **salable quantity** shown to customers is calculated as:

```
Salable = Units in Stock − Units Reserved
```

**Units Reserved** is managed automatically by the system: when customers place orders, stock is reserved to prevent overselling.

## Per-Variant Stock Tracking

When a product uses [variants](./variants), each variant tracks its own stock independently. Set the **Units in Stock** for each variant in the variant's **Inventory** tab.

When a variant-specific combination is purchased, only that variant's stock is affected: other variants and the product-level stock remain unchanged.

## Stock and Order Lifecycle

Stock changes follow a two-phase reservation lifecycle tied to order statuses:

### 1. Order Placed (New)

When a customer places an order, stock is **reserved** for all items in the order. The physical quantity stays the same, but the reserved count increases: reducing the salable quantity visible to other customers. This prevents overselling when multiple customers are shopping simultaneously.

### 2. Order Shipped

When the order status changes to **Shipped**, the physical stock is **decreased** and the reservation is **released**. At this point, the units have left the warehouse.

### 3. Order Cancelled

If an order is cancelled before shipment, the reservation is **released** without changing the physical stock. The salable quantity is restored, making those units available for other customers.

### 4. Order Refunded

If an order is refunded after shipment, no automatic stock adjustment occurs because the units have already left the warehouse. If the items are physically returned, you can manually increase the stock on the product form.

::: info
The order status flow for inventory is: **New** (reserve) → **Paid** (no stock action) → **Shipped** (decrease) or **Cancelled** (release). The **Paid** status is a billing milestone and does not affect stock.
:::

## Low-Stock Notifications

When a product goes out of stock (or falls below its stock alert threshold), Meloncart sends an email notification to all backend users in the **store-managers** admin group.

To receive low-stock notifications:

1. Create a backend user group with the code `store-managers` under **Settings → Administrators → Groups** (if it does not already exist).
2. Add the backend users who should receive notifications to this group.

::: info
The low-stock email template can be customized under **Settings → Mail Templates** by editing the `shop:low_stock_internal` template.
:::

## Out-of-Stock Behavior

A product is considered out of stock when its salable quantity reaches zero (or falls to or below the **Out Of Stock Threshold**, if one is set).

Out-of-stock behavior depends on the product's settings:

- **Hidden When Out Of Stock**: The product is automatically hidden from the storefront when it goes out of stock.
- **Allow Pre-Order**: Customers can still purchase the product even when it is out of stock. This is useful for upcoming products or items with a known restock date.
- **Allow Negative Stock**: The stock count can go below zero, allowing orders to be accepted beyond current inventory.

::: tip
If none of these options are enabled and a product goes out of stock, it remains visible on the storefront but cannot be added to the cart.
:::

## Products Without Inventory Tracking

When the **Track Inventory** checkbox is not enabled, the product is treated as always in stock. No stock fields are shown, no stock decreases occur on purchase, and no low-stock notifications are sent. This is appropriate for digital products, services, or items with unlimited availability.

## Multi-Warehouse Inventory

For stores that need to track stock across multiple physical locations (warehouses), the **Meloncart Inventory** plugin extends the shop with warehouse-based inventory management. When installed, it replaces the simple stock field with per-warehouse stock tracking, priority-based fulfillment, and site-specific stock visibility.

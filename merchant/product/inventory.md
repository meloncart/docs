---
subtitle: Track and manage product stock levels.
---
# Inventory

Meloncart includes a built-in inventory system that tracks stock levels, prevents overselling, and sends low-stock notifications. Inventory tracking is optional and can be configured per product.

## Enabling Inventory Tracking

Inventory tracking is available when the product type has the **Has Inventory** feature enabled. On the product form, check the **Track Inventory** checkbox to activate stock management for that product.

Once enabled, the following fields become available:

- **Units in Stock** — The current number of units available for sale. This field is required when inventory tracking is enabled.
- **Stock Alert Threshold** — An optional stock level that triggers a low-stock notification. When stock falls to or below this number, store managers are notified by email.

## Stock Behavior

### Automatic Stock Reduction

When an order is placed, the stock count for each purchased product is automatically reduced by the ordered quantity. This happens during order processing, not at the moment the item is added to the cart.

### Out-of-Stock Products

A product is considered out of stock when its **Units in Stock** reaches zero (or falls to or below the **Stock Alert Threshold**, if one is set).

Out-of-stock behavior depends on the product's settings:

- **Hide if Out of Stock** — When enabled, the product is automatically hidden from the storefront when it goes out of stock.
- **Allow Pre-Order** — When enabled, customers can still purchase the product even when it is out of stock. This is useful for upcoming products or items with a known restock date.
- **Allow Negative Stock** — When enabled, the stock count can go below zero. This is useful when you want to accept orders beyond your current inventory and fulfill them when new stock arrives.

::: tip
If none of these options are enabled and a product goes out of stock, it remains visible on the storefront but cannot be added to the cart.
:::

## Per-Variant Stock Tracking

When a product uses [variants](./variants), each variant can track its own stock independently. Set the **Units in Stock** field on an individual variant to manage that combination's inventory separately.

If a variant's stock field is left empty, inventory tracking falls back to the product level. This means you can mix approaches within the same product — some variants with their own stock counts, and others sharing the product's stock.

When a variant has its own stock:
- The variant's stock is decreased when that specific combination is purchased.
- Low-stock alerts are triggered based on the variant's stock level and threshold.
- The variant fires its own out-of-stock event independently of the product.

When a variant defers to the product:
- The product's stock is decreased instead.
- Alerts and out-of-stock behavior follow the product's settings.

## Low-Stock Notifications

When a product or variant goes out of stock (or falls below its stock alert threshold), Meloncart sends an email notification to all backend users in the **store-managers** admin group.

To receive low-stock notifications:

1. Create a backend user group with the code `store-managers` under **Settings → Administrators → Groups** (if it does not already exist).
2. Add the backend users who should receive notifications to this group.

The notification email includes details about the product that triggered the alert, allowing store managers to take action such as reordering from suppliers or disabling the product.

::: info
The low-stock email template can be customized under **Settings → Mail Templates** by editing the `shop:low_stock_internal` template.
:::

## Stock and Order Lifecycle

Stock changes are tied to the order lifecycle:

1. **Customer places an order** — Stock is decreased for all items in the order.
2. **Low-stock check** — After stock is decreased, the system checks whether any products have fallen below their alert threshold and sends notifications if so.
3. **Order cancellation or refund** — Stock can be manually restored through the order management interface when an order is cancelled or refunded.

::: warning
Stock is not reserved when items are added to the cart. Two customers can add the last unit of a product to their carts simultaneously. The first to complete checkout receives the item; the second may encounter an out-of-stock condition at checkout time.
:::

## Products Without Inventory Tracking

When the **Track Inventory** checkbox is not enabled, the product is treated as always in stock. No stock fields are shown, no stock decreases occur on purchase, and no low-stock notifications are sent. This is appropriate for digital products, services, or items with unlimited availability.

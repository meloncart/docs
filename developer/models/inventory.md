---
subtitle: Stock tracking, reservation lifecycle, and inventory model reference.
---
# Inventory

This reference documents the inventory system used by Meloncart's Shop plugin. The base system uses `units_in_stock` and `units_reserved` columns on Product and ProductVariant. For multi-warehouse support, see the [Inventory Plugin](#inventory-plugin) section.

## Product Inventory Properties

| Property | Type | Description |
|----------|------|-------------|
| `track_inventory` | `bool` | Whether stock is tracked |
| `hide_if_out_of_stock` | `bool` | Hide product when out of stock |
| `allow_negative_stock` | `bool` | Allow stock to go below zero |
| `stock_alert_threshold` | `int` | Low stock notification threshold |
| `allow_pre_order` | `bool` | Accept orders when out of stock |
| `units_in_stock` | `int\|null` | Physical units on hand |
| `units_reserved` | `int` | Units held by pending orders |

## Product Inventory Methods

The [Product](./product) and `ProductVariant` models provide inventory methods.

### getSalableQuantity

Returns the available stock (physical minus reserved).

```php
$product->getSalableQuantity(?int $siteId = null): int
```

Returns `max(0, units_in_stock - units_reserved)`. The `$siteId` parameter is accepted for API compatibility but is ignored in the base implementation.

### isOutOfStock

Returns whether the product is out of stock. Accounts for `track_inventory` and `stock_alert_threshold`.

```php
$product->isOutOfStock(): bool
```

Returns `false` if `track_inventory` is disabled. When a `stock_alert_threshold` is set, returns `true` if salable quantity is at or below the threshold.

### reserveStock

Atomically increments `units_reserved` for a pending order.

```php
$product->reserveStock(int $quantity): void
```

### decreaseStock

Atomically decrements `units_in_stock` and releases the reservation. Fires `shop.productOutOfStock` if stock falls below the threshold.

```php
$product->decreaseStock(int $quantity): void
```

When `allow_negative_stock` is false, a database guard prevents stock from going below zero.

### releaseStock

Releases a reservation without touching physical stock.

```php
$product->releaseStock(int $quantity): void
```

### Variant Methods

`ProductVariant` provides the same methods: `getSalableQuantity()`, `isOutOfStock()`, `reserveStock()`, `decreaseStock()`, and `releaseStock()`: operating on variant-level stock.

---

## Stock Lifecycle

The inventory system uses a two-phase reservation model to prevent overselling:

```
Order placed (New)    → units_reserved += qty     (salable drops, physical unchanged)
Order shipped         → units_in_stock -= qty,    (physical stock leaves)
                        units_reserved -= qty
Order cancelled       → units_reserved -= qty     (salable restored, no physical change)
```

### How Status Changes Trigger Stock Actions

Stock operations are dispatched in `OrderStatusLog::createRecord()` based on the order status code:

| Status Code | Constant | Stock Action |
|-------------|----------|-------------|
| `new` | `OrderStatus::STATUS_NEW` | `$order->reserveStockValues()` |
| `paid` | `OrderStatus::STATUS_PAID` | `$order->markAsPaymentProcessed()` (no stock action) |
| `shipped` | `OrderStatus::STATUS_SHIPPED` | `$order->decreaseStockValues()` |
| `cancelled` | `OrderStatus::STATUS_CANCELLED` | `$order->releaseStockValues()` |
| `refunded` | `OrderStatus::STATUS_REFUNDED` | No action (stock already shipped) |

Each stock action fires the `shop.order.stockChanged` event before executing. Return `false` from this event to prevent the default stock behavior and handle it externally.

### Order Methods

The `Order` model provides three stock lifecycle methods that iterate over all order items:

```php
$order->reserveStockValues();   // Reserve stock for all items
$order->decreaseStockValues();  // Decrement stock for all items
$order->releaseStockValues();   // Release reservations for all items
```

Each method loops through the order's items and calls the corresponding `reserveStock()`, `decreaseStock()`, or `releaseStock()` method on the item's variant (if present) or product.

---

## Concurrency Safety

All stock operations use atomic database updates to handle concurrent requests safely:

```php
// Example: atomic reservation
Db::table('shop_products')
    ->where('id', $this->id)
    ->update(['units_reserved' => Db::raw("units_reserved + " . (int) $quantity)]);
```

This ensures that two simultaneous orders cannot both claim the same stock. The `units_reserved` counter acts as a soft lock: salable quantity (`units_in_stock - units_reserved`) decreases immediately when an order is placed.

---

## Displaying Stock on the Storefront

Use the `isOutOfStock()` method for stock-aware templates:

```twig
{% if product.track_inventory %}
    {% if product.isOutOfStock() %}
        {% if product.allow_pre_order %}
            <span class="badge bg-warning">
                Pre-Order
            </span>
        {% else %}
            <span class="badge bg-danger">
                Out of Stock
            </span>
        {% endif %}
    {% else %}
        <span class="text-success">
            In Stock
        </span>
    {% endif %}
{% endif %}
```

::: warning
Avoid displaying exact stock quantities to customers. The salable quantity changes in real time as other customers place orders, and showing exact numbers can create a poor experience if the count changes between page loads.
:::

### Variant Stock

```twig
{% set variant = product.resolveVariantSafe(post('product_options', {})) %}

{% if variant %}
    {% if variant.isOutOfStock() %}
        <div class="alert alert-warning">
            This combination is currently out of stock.
        </div>
    {% endif %}
{% endif %}
```

---

## Inventory Plugin

The **Meloncart Inventory** plugin (`meloncart/inventory`) extends the shop with multi-warehouse inventory management. When installed, it:

- Adds `Warehouse` and `InventoryStock` models for per-location stock tracking
- Overrides `getSalableQuantity()` on Product and ProductVariant to aggregate stock across warehouses assigned to the current site
- Intercepts `shop.order.stockChanged` to perform warehouse-based reserve/decrease/release instead of modifying local columns
- Replaces the `units_in_stock` field on product forms with a warehouse stock relation widget
- Adds a **Warehouses** controller under the Shop menu

The plugin uses the existing `shop.order.stockChanged` event: returning `false` to prevent the default local-column stock operations and handling inventory through `InventoryStock` static methods instead.

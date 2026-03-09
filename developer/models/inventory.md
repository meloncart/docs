---
subtitle: Warehouse, InventoryStock, and stock lifecycle model reference.
---
# Inventory Models

This reference documents the models and methods for Meloncart's warehouse-based inventory system. The inventory system tracks stock across multiple physical locations (warehouses) and uses a two-phase reservation lifecycle to prevent overselling.

## Warehouse

The `Warehouse` model represents a physical location where inventory is stored. Warehouses are scoped by site group using the `MultisiteGroup` trait, and are mapped to specific site definitions via a pivot table.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Primary key |
| `name` | `string` | Warehouse name |
| `code` | `string` | Unique code identifier |
| `description` | `string\|null` | Internal description |
| `address_line1` | `string\|null` | Street address |
| `city` | `string\|null` | City |
| `zip` | `string\|null` | Postal/ZIP code |
| `state_id` | `int\|null` | State/province FK |
| `country_id` | `int\|null` | Country FK |
| `contact_name` | `string\|null` | Contact person name |
| `contact_email` | `string\|null` | Contact email |
| `contact_phone` | `string\|null` | Contact phone |
| `is_enabled` | `bool` | Whether the warehouse is active |
| `sort_order` | `int` | Default fulfillment priority |
| `site_group_id` | `int` | Site group for multisite scoping |
| `created_at` | `Carbon` | Creation date |
| `updated_at` | `Carbon` | Last update date |

### Relationships

| Property | Type | Description |
|----------|------|-------------|
| `sites` | `Collection<SiteDefinition>` | Assigned site definitions (with `priority` pivot) |
| `inventory_stocks` | `Collection<InventoryStock>` | Stock records at this warehouse |
| `country` | `Country` | Country (via LocationModel trait) |
| `state` | `State` | State/province (via LocationModel trait) |

### Traits

| Trait | Purpose |
|-------|---------|
| `MultisiteGroup` | Scopes warehouses by site group (store) |
| `LocationModel` | Provides country/state relationship support |
| `Sortable` | Enables drag-and-drop reordering |
| `Validation` | Model validation rules |

### Site Assignment

Warehouses are assigned to site definitions through the `shop_warehouse_sites` pivot table, which includes a `priority` column. Lower priority numbers indicate higher fulfillment preference.

```php
// Get all sites a warehouse fulfills for
$warehouse->sites; // Collection<SiteDefinition>

// Check priority for a specific site
$warehouse->sites->first()->pivot->priority; // int
```

When multiple warehouses serve the same site, stock is aggregated across all of them. During stock operations (reserve, decrement, release), warehouses are processed in priority order — the highest-priority warehouse is drawn from first, with overflow spilling to the next.

---

## InventoryStock

The `InventoryStock` model is the core junction entity that tracks the quantity of a product (or variant) at a specific warehouse. Each record represents one product-warehouse combination.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Primary key |
| `warehouse_id` | `int` | FK to `shop_warehouses` |
| `product_id` | `int` | FK to `shop_products` |
| `variant_id` | `int\|null` | FK to `shop_product_variants` (null = product-level stock) |
| `quantity` | `int` | Physical units on hand |
| `reserved` | `int` | Units reserved by pending orders |
| `created_at` | `Carbon` | Creation date |
| `updated_at` | `Carbon` | Last update date |

### Computed Properties

| Property | Type | Description |
|----------|------|-------------|
| `salable` | `int` | Available quantity: `max(0, quantity - reserved)` |

### Relationships

| Property | Type | Description |
|----------|------|-------------|
| `warehouse` | `Warehouse` | The warehouse holding this stock |
| `product` | `Product` | The product |
| `variant` | `ProductVariant\|null` | The variant (null for product-level stock) |

### Static Methods

These methods perform stock operations across all warehouses assigned to a site, using atomic database updates for concurrency safety.

#### getSalableQuantity

Returns the total salable quantity for a product/variant across all enabled warehouses assigned to the given site.

```php
InventoryStock::getSalableQuantity(
    int $productId,
    ?int $variantId,
    int $siteId
): int
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `$productId` | `int` | Product ID |
| `$variantId` | `int\|null` | Variant ID (`null` for product-level stock) |
| `$siteId` | `int` | Site definition ID |

**Returns:** Sum of `(quantity - reserved)` across matching warehouses.

```php
// Get salable stock for a product on the current site
$salable = InventoryStock::getSalableQuantity($product->id, null, $siteId);

// Get salable stock for a specific variant
$salable = InventoryStock::getSalableQuantity($product->id, $variant->id, $siteId);
```

#### reserveForProduct

Reserves stock across warehouses by priority order. Called when an order is placed (status: New).

```php
InventoryStock::reserveForProduct(
    int $productId,
    ?int $variantId,
    int $quantity,
    int $siteId
): void
```

Increments the `reserved` column using atomic updates (`reserved = reserved + ?`). Processes warehouses in priority order — if the highest-priority warehouse has insufficient available stock, the remainder spills to the next warehouse.

#### decrementForProduct

Decrements physical stock and releases the corresponding reservation. Called when an order is shipped.

```php
InventoryStock::decrementForProduct(
    int $productId,
    ?int $variantId,
    int $quantity,
    int $siteId,
    bool $allowNegative = false
): void
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `$allowNegative` | `bool` | When `true`, allows stock to go below zero |

Both `quantity` and `reserved` are decremented atomically. When `$allowNegative` is `false`, a `WHERE quantity >= ?` guard prevents the stock from going negative.

#### releaseForProduct

Releases a reservation without touching physical stock. Called when an order is cancelled.

```php
InventoryStock::releaseForProduct(
    int $productId,
    ?int $variantId,
    int $quantity,
    int $siteId
): void
```

Decrements only the `reserved` column, restoring the salable quantity for other customers.

---

## Product Inventory Methods

The [Product](./product) and `ProductVariant` models provide inventory methods that delegate to `InventoryStock`.

### getSalableQuantity

Returns the total salable stock for the product across all warehouses assigned to the given site (or the current site by default).

```php
$product->getSalableQuantity(?int $siteId = null): int
```

When `$siteId` is `null`, the current site from context is used.

### isOutOfStock

Returns whether the product is out of stock on the current site. Accounts for `track_inventory` and `stock_alert_threshold`.

```php
$product->isOutOfStock(): bool
```

Returns `false` if `track_inventory` is disabled. When a `stock_alert_threshold` is set, returns `true` if salable quantity is at or below the threshold.

### reserveStock

Reserves the given quantity across warehouses for the current site.

```php
$product->reserveStock(int $quantity): void
```

### decreaseStock

Decrements physical stock and releases the reservation. Fires `shop.productOutOfStock` if stock falls below the threshold.

```php
$product->decreaseStock(int $quantity): void
```

### releaseStock

Releases a reservation without touching physical stock.

```php
$product->releaseStock(int $quantity): void
```

### Variant Methods

`ProductVariant` provides the same methods — `getSalableQuantity()`, `isOutOfStock()`, `reserveStock()`, `decreaseStock()`, and `releaseStock()` — operating on variant-level stock records.

---

## Stock Lifecycle

The inventory system uses a two-phase reservation model to prevent overselling:

```
Order placed (New)    → reserved += qty        (salable drops, physical unchanged)
Order shipped         → quantity -= qty,       (physical stock leaves warehouse)
                        reserved -= qty
Order cancelled       → reserved -= qty        (salable restored, no physical change)
```

### How Status Changes Trigger Stock Actions

Stock operations are dispatched in `OrderStatusLog::createRecord()` based on the order status code:

| Status Code | Constant | Stock Action |
|-------------|----------|-------------|
| `new` | `OrderStatus::STATUS_NEW` | `$order->reserveStockValues()` |
| `paid` | `OrderStatus::STATUS_PAID` | `$order->markAsPaymentProcessed()` (no stock action) |
| `shipped` | `OrderStatus::STATUS_SHIPPED` | `$order->decreaseStockValues()` |
| `cancelled` | `OrderStatus::STATUS_CANCELLED` | `$order->releaseStockValues()` |
| `refunded` | `OrderStatus::STATUS_REFUNDED` | No action (stock already left warehouse) |

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
Db::table('shop_inventory_stocks')
    ->where('id', $stock->id)
    ->update(['reserved' => Db::raw("reserved + {$toReserve}")]);
```

This ensures that two simultaneous orders cannot both claim the same stock. The `reserved` counter acts as a soft lock — salable quantity (`quantity - reserved`) decreases immediately when an order is placed, preventing other customers from purchasing units that are already committed to pending orders.

---

## Displaying Stock on the Storefront

Use the `isOutOfStock()` method and `getSalableQuantity()` for stock-aware templates:

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

## Database Schema

### shop_warehouses

| Column | Type | Description |
|--------|------|-------------|
| `id` | `bigint` PK | Auto-increment |
| `name` | `varchar(255)` | Warehouse name |
| `code` | `varchar(255)` | Unique code (indexed) |
| `description` | `text` | Optional description |
| `address_line1` | `varchar(255)` | Street address |
| `city` | `varchar(255)` | City |
| `zip` | `varchar(255)` | Postal code |
| `state_id` | `int` | FK to states |
| `country_id` | `int` | FK to countries |
| `contact_name` | `varchar(255)` | Contact name |
| `contact_email` | `varchar(255)` | Contact email |
| `contact_phone` | `varchar(255)` | Contact phone |
| `is_enabled` | `tinyint(1)` | Active flag |
| `sort_order` | `int` | Default priority |
| `site_group_id` | `int` | Multisite group FK |
| `timestamps` | | Created/updated |

### shop_warehouse_sites

| Column | Type | Description |
|--------|------|-------------|
| `warehouse_id` | `bigint` | FK to `shop_warehouses` |
| `site_definition_id` | `int` | FK to `system_site_definitions` |
| `priority` | `int` | Fulfillment priority (lower = preferred) |

**Unique constraint:** `(warehouse_id, site_definition_id)`

### shop_inventory_stocks

| Column | Type | Description |
|--------|------|-------------|
| `id` | `bigint` PK | Auto-increment |
| `warehouse_id` | `bigint` | FK to `shop_warehouses` |
| `product_id` | `bigint` | FK to `shop_products` |
| `variant_id` | `bigint\|null` | FK to `shop_product_variants` (null = product-level) |
| `quantity` | `int` | Physical units on hand |
| `reserved` | `int` | Units held by pending orders |
| `timestamps` | | Created/updated |

**Unique constraint:** `(warehouse_id, product_id, variant_id)`

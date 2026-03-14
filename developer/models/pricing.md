---
subtitle: How pricing works across Products, Variants, Cart Items, and Order Items.
---
# Pricing

This guide explains how prices flow through the system — from database values to template display — and documents the unified pricing vocabulary that works consistently across all commerce objects.

## Price Vocabulary

Every commerce object exposes the same set of display attributes. Whether you're rendering a product card, a cart line item, or an order receipt, the attribute names are identical.

| Attribute | Type | Description |
|-----------|------|-------------|
| `display_price` | `int` | Best price for display, tax-aware |
| `compare_price` | `int` | Base price for strikethrough comparison, tax-aware |
| `on_sale` | `bool` | Whether the two prices differ |
| `display_discount` | `int` | Per-unit savings: `compare_price - display_price` |
| `display_line_price` | `int` | Total for all units, tax-aware (CartItem / OrderItem only) |
| `display_line_discount` | `int` | Total savings across all units (CartItem / OrderItem only) |

### Availability by Model

| Attribute | Product | Variant | CartItem | OrderItem | Extra |
|-----------|---------|---------|----------|-----------|-------|
| `display_price` | Yes | Yes | Yes | Yes | Yes |
| `compare_price` | Yes | Yes | Yes | Yes | — |
| `on_sale` | Yes | Yes | Yes | Yes | — |
| `display_discount` | Yes | Yes | Yes | Yes | — |
| `display_line_price` | — | — | Yes | Yes | — |
| `display_line_discount` | — | — | Yes | Yes | — |

::: tip Unified Templates
Because all models share the same attribute names, you can write pricing markup once:

```twig
{% set item = variant ?: product %}

{{ item.display_price|currency }}
{% if item.on_sale %}
    <del>{{ item.compare_price|currency }}</del>
    <span>Save {{ item.display_discount|currency }}</span>
{% endif %}
```

This pattern works identically whether `item` is a Product, ProductVariant, CartItem, or OrderItem.
:::

---

## The Pricing Pipeline

Prices pass through several stages before reaching the template. Each stage can modify the price.

```
DB column ($product->price)
    │
    ▼
Tier Pricing (quantity + user group)
    │
    ▼
Sale Price (manual is_on_sale or catalog price rules)
    │
    ▼
Tax Display Adjustment (applyTaxDisplay)
    │
    ▼
Template Attribute (display_price, compare_price)
```

### What Each Stage Does

1. **DB column** — The raw `price` column stored in base currency units (cents). This is always the starting point.

2. **Tier Pricing** — If the product has volume pricing tiers, the price is reduced based on the quantity being purchased and the customer's user group.

3. **Sale Price** — Two sources can reduce the price further:
   - **Manual sale** — The `is_on_sale` checkbox with a `sale_price` value
   - **Catalog price rules** — Compiled rules that apply discounts based on categories, dates, or user groups

4. **Tax Display** — The `applyTaxDisplay()` method adjusts the price based on store tax settings (see [Tax Display](#tax-display) below).

### `display_price` vs `compare_price`

- **`display_price`** passes through ALL stages — it's the best price the customer pays.
- **`compare_price`** skips the sale price stage — it's what the customer would pay without any sale or catalog rule discount.

When these two values differ, `on_sale` returns `true`.

---

## Tax Display

The store has two tax settings (configured in **Settings → eCommerce Settings**):

| Setting | Meaning |
|---------|---------|
| `pricesIncludeTax` | Whether DB prices already include tax |
| `displayPricesWithTax` | Whether storefront prices should show tax |

These combine into four scenarios:

| Prices Include Tax | Display With Tax | Action |
|---|---|---|
| No | No | Return raw price |
| No | Yes | **Add** tax to price |
| Yes | Yes | Return raw price |
| Yes | No | **Remove** tax from price |

The `applyTaxDisplay()` method handles this automatically on every model. You never need to think about tax when writing templates — just use `display_price` and `compare_price`.

::: info
The tax class is resolved from the product's `tax_class_id`. If no tax class is assigned, prices are returned unchanged.
:::

::: warning Important for PHP Callers
The `display_price` attribute relies on global tax context that is auto-initialized on web requests via `CheckoutData::ensureTaxContext()`. If you access `display_price` outside a web request (CLI commands, queue jobs, API endpoints), you must set context explicitly:

```php
use Meloncart\Shop\Models\TaxClass;

TaxClass::withContext($address, $pricesIncludeTax, function() use ($product) {
    $price = $product->display_price; // Correctly resolved
});
```

Within templates and component handlers, this is handled automatically — no action needed.
:::

---

## Sale Prices

A product is considered "on sale" when `display_price` differs from `compare_price`. This can happen two ways:

### Manual Sales

Set the **On Sale** checkbox and enter a **Sale Price** on the product form. This takes priority over catalog rules.

```twig
{# Works for both manual sales and catalog rules #}
{% if product.on_sale %}
    <span class="badge bg-danger">Sale!</span>
{% endif %}
```

### Catalog Price Rules

Catalog price rules are compiled into the product's pricing data. They can apply percentage or fixed discounts based on categories, date ranges, or user groups. The `on_sale` attribute catches both sources automatically.

### Variant Sale Prices

Variants can have their own `is_on_sale` and `sale_price`. If neither is set, the variant inherits the parent product's sale price. The `on_sale` attribute on a variant reflects whichever applies.

---

## Tier Pricing

Products can have volume-based pricing tiers. Each tier specifies a minimum quantity and a price. Tiers can be scoped to specific user groups.

```twig
{% set visibleTiers = product.visible_price_tiers %}
{% if visibleTiers is not empty %}
    <table>
        <tr>
            <th>Quantity</th>
            <th>Price</th>
        </tr>
        <tr>
            <td>1+</td>
            <td>{{ product.compare_price|currency }}</td>
        </tr>
        {% for tier in visibleTiers %}
            <tr>
                <td>{{ tier.quantity_label }}</td>
                <td>{{ tier.price|currency }}</td>
            </tr>
        {% endfor %}
    </table>
{% endif %}
```

The `visible_price_tiers` attribute automatically shows user-group-specific tiers when available, falling back to generic tiers otherwise.

---

## Cart Discounts

Cart price rules (coupons, promotions) apply discounts at the cart level, separate from catalog-level sale prices. These are reflected in the `display_price` and `display_line_price` attributes on CartItem.

| CartItem Attribute | Description |
|---|---|
| `display_price` | Unit price after all discounts, tax-aware |
| `compare_price` | Unit price without cart discounts (but with catalog discounts), tax-aware |
| `on_sale` | Whether cart discounts are applied |
| `display_discount` | Per-unit savings from cart discounts |
| `display_line_price` | Total for all units after discounts, tax-aware |
| `compare_line_price` | Total without cart discounts, tax-aware |
| `display_line_discount` | Total savings across all units |

::: info Internal Methods
CartItem also exposes internal methods used by the pricing engine: `getUnitPrice()`, `getUnitLinePrice()`, `getCartDiscount()`, `getCatalogDiscount()`, etc. These are for PHP callers (price rules, `fillFromCartItem`). For templates, always use the `display_*` / `compare_*` attributes.
:::

---

## Template Recipes

### Product Card with Sale Badge

```twig
<div class="product-card">
    {% if product.on_sale %}
        <span class="badge bg-danger">Sale!</span>
    {% endif %}

    <h3>{{ product.name }}</h3>

    <span>{{ product.display_price|currency }}</span>
    {% if product.on_sale %}
        <del>{{ product.compare_price|currency }}</del>
    {% endif %}
</div>
```

### Cart Line Item with Discount

```twig
{% for item in items %}
    <div class="cart-item">
        <span>{{ item.product.name }}</span>

        {# Unit price with strikethrough #}
        <span>{{ item.display_price|currency }}</span>
        {% if item.on_sale %}
            <del>{{ item.compare_price|currency }}</del>
        {% endif %}

        <span>x {{ item.quantity }}</span>

        {# Line total #}
        <span>{{ item.display_line_price|currency }}</span>
    </div>
{% endfor %}
```

### Order Summary

```twig
{% for item in order.items %}
    <div>
        {{ item.product.name }}
        —
        {{ item.display_price|currency }} x {{ item.quantity }}
        =
        {{ item.display_line_price|currency }}
    </div>
{% endfor %}

<div>
    Subtotal: {{ order.final_subtotal|currency }}
</div>
{% if order.discount %}
    <div>
        Discount: -{{ order.final_discount|currency }}
    </div>
{% endif %}
<div>
    Shipping: {{ order.final_shipping_quote|currency }}
</div>
<div>
    Total: {{ order.total|currency }}
</div>
```

### Variant-Aware Product Page

```twig
{# Resolve variant from selected options #}
{% set postedOptions = post('product_options', {}) %}
{% set variant = product.use_variants ? product.resolveVariantSafe(postedOptions) : null %}
{% set item = variant ?: product %}

{# Same markup works for both #}
<span class="fw-bold">{{ item.display_price|currency }}</span>
{% if item.on_sale %}
    <del>{{ item.compare_price|currency }}</del>
    <span>Save {{ item.display_discount|currency }}</span>
{% endif %}
```

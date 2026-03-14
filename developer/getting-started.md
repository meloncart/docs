---
subtitle: Build your first storefront in 5 minutes.
---
# Quick Start

This tutorial walks through building a minimal storefront with Meloncart. By the end you'll have a product listing, a product page with add-to-cart, and a working checkout.

::: tip Prerequisites
Install Meloncart and its dependencies first. See the [Installation Guide](/developer/installation) for details.
:::

## 1. Product Listing Page

Create a page that lists products using the **Catalog** component.

```ini
url = "/shop"

[catalog]
lookup = "category"
```

```twig
{% set products = catalog.products %}

<div class="row">
    {% for product in products %}
        <div class="col-md-4 mb-4">
            <div class="card">
                <img src="{{ product.images.first.thumb(300, 300) }}" class="card-img-top" />
                <div class="card-body">
                    <h5>{{ product.name }}</h5>
                    <p>{{ product.display_price|currency }}</p>
                    {% if product.on_sale %}
                        <s class="text-muted">{{ product.compare_price|currency }}</s>
                    {% endif %}
                    <a href="{{ product.url }}" class="btn btn-primary">View</a>
                </div>
            </div>
        </div>
    {% endfor %}
</div>
```

Key points:
- `product.display_price` is the best price for the customer, automatically adjusted for your store's [tax display settings](/developer/models/pricing#tax-display)
- `product.compare_price` is the original/strikethrough price
- `product.on_sale` is `true` when a sale or catalog discount applies
- See the [Pricing guide](/developer/models/pricing) for the full vocabulary

## 2. Product Detail Page

Create a page that displays a single product with an add-to-cart button. This page uses both the **Catalog** and **Cart** components.

```ini
url = "/shop/product/:slug*/:baseid"

[catalog]
lookup = "product"
identifier = "baseid"

[cart]
```

```twig
{% set product = catalog.product %}
{% set item = product.variant ?: product %}

<h1>{{ product.name }}</h1>

<p class="fs-4">{{ item.display_price|currency }}</p>
{% if item.on_sale %}
    <s class="text-muted">{{ item.compare_price|currency }}</s>
{% endif %}

{% if product.has_variants %}
    {% partial 'shop-product/product-options' %}
{% endif %}

<form data-request="cart::onAddToCart" data-request-flash>
    <input type="hidden" name="product_baseid" value="{{ product.baseid }}" />
    <input type="number" name="product_cart_quantity" value="1" min="1" class="form-control w-auto mb-3" />
    <button type="submit" class="btn btn-primary" data-attach-loading>
        Add to Cart
    </button>
</form>

{% if product.in_stock %}
    <span class="badge bg-success">In Stock</span>
{% else %}
    <span class="badge bg-danger">Out of Stock</span>
{% endif %}
```

Key points:
- `{% set item = product.variant ?: product %}` lets you show the active variant's price when one is selected
- `product.has_variants` checks if the product uses variant options
- `product.in_stock` is a convenience boolean
- The `cart::onAddToCart` handler adds the product to the session cart

## 3. Cart Page

Create a cart page to review items before checkout.

```ini
url = "/shop/cart"

[cart]
```

```twig
{% set items = cart.items %}

{% if items is empty %}
    <p>Your cart is empty.</p>
{% else %}
    <table class="table">
        <thead>
            <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            {% for item in items %}
                <tr>
                    <td>{{ item.name }}</td>
                    <td>{{ item.display_price|currency }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ item.display_line_price|currency }}</td>
                </tr>
            {% endfor %}
        </tbody>
    </table>

    <p class="fs-5">
        Total: {{ cart.totalPrice|currency }}
    </p>

    <a href="{{ 'shop/checkout'|page }}" class="btn btn-primary">Proceed to Checkout</a>
{% endif %}
```

Key points:
- `item.display_price` and `item.display_line_price` use the same vocabulary as Product
- `item.on_sale` is `true` when cart discounts (coupons) reduce the price

## 4. Checkout Page

The checkout uses the **Checkout** component and walks through three steps: details, shipping, and payment.

```ini
url = "/shop/checkout"

[checkout]
```

```twig
{% partial 'shop-checkout/checkout-view' %}
```

The `checkout-view` partial is provided by the Commerce Theme and handles the full multi-step flow. You can customize it by overriding the partials in your theme.

The checkout component provides these AJAX handlers:
- `onRefreshCheckout` — refreshes checkout partials after form changes
- `onPlaceOrder` — creates the order and redirects to payment
- `onApplyCoupon` / `onRemoveCoupon` — coupon management

## 5. Querying Orders

After orders are placed, query them using the Order model scopes:

```php
use Meloncart\Shop\Models\Order;

// Recent paid orders
$orders = Order::wherePaid()->applyRecent()->get();

// Orders for a specific user
$orders = Order::applyUser($user)->applyRecent()->get();

// Filter by status
$orders = Order::whereStatus('shipped')->get();

// Exclude cancelled/refunded
$orders = Order::applyCompleted()->get();
```

Order convenience booleans work in Twig templates:

```twig
{% if order.is_paid %}
    Payment received
{% endif %}

{% if order.is_shipped %}
    Shipped — tracking: {{ order.latestTrackingCode.code }}
{% endif %}

{% if order.is_cancelled %}
    This order was cancelled
{% endif %}
```

## Next Steps

- [Pricing](/developer/models/pricing) — understand how `display_price`, `compare_price`, and tax display work
- [Catalog Component](/developer/components/catalog) — full filtering, sorting, and search API
- [Cart Component](/developer/components/cart) — cart management, shipping estimates
- [Checkout Component](/developer/components/checkout) — step-by-step checkout customization
- [Events](/developer/hooks/events) — extend the order lifecycle, stock management, and more
- [Price Rules](/developer/extending/price-rules) — build custom discount logic

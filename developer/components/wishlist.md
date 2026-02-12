---
subtitle: Manage customer wishlists.
---
# Wishlist

Meloncart does not have a dedicated wishlist component. Instead, wishlists are implemented using the **named carts** feature of the [Cart](./cart) component. By passing `cart_name = "wishlist"` to the cart's AJAX handlers, you create a separate cart that acts as a saved-for-later list.

This approach reuses all existing cart infrastructure — session storage for guests, database storage for logged-in users, and the same AJAX handlers — without any additional plugin code.

## How Named Carts Work

The Cart component's AJAX handlers accept a `cart_name` parameter that determines which cart to operate on. The default cart is named `main`. Any other name creates an independent cart with its own items:

- `main` — The shopping cart (default)
- `wishlist` — A saved-for-later list
- Any custom name — Additional named carts for your own purposes

Each named cart has its own items, quantities, and state. Items in one named cart do not affect another.

## Adding Items to the Wishlist

Use the `onAddToCart` handler with `cart_name: 'wishlist'`:

```html
<button
    data-request="onAddToCart"
    data-request-data="{
        product_baseid: '{{ product.baseid }}',
        cart_name: 'wishlist'
    }"
    data-request-update="{ 'shop/wishlist-count': '#wishlistCount' }"
    data-request-flash>
    Save to Wishlist
</button>
```

## Removing Items from the Wishlist

Use the `onRemoveFromCart` handler. The `cart_name` is passed alongside the item key:

```html
<a href="javascript:;"
    data-request="onRemoveFromCart"
    data-request-data="{
        key: '{{ item.key }}',
        cart_name: 'wishlist'
    }"
    data-request-update="{ 'shop/wishlist-items': '#wishlistItems' }">
    Remove from Wishlist
</a>
```

## Displaying Wishlist Items

To display the wishlist, use the Cart component's Twig API with the wishlist cart context. The `cart` component methods always operate on the `main` cart by default, so you need to access the wishlist items through the cart manager.

One approach is to create a dedicated partial that lists the wishlist items:

```twig
{# partials/shop/wishlist-items.htm #}
{% set wishlistItems = cart.listActiveItems %}

{% if wishlistItems is not empty %}
    <div class="row g-4">
        {% for item in wishlistItems %}
            {% set product = item.product %}
            <div class="col-md-4">
                <div class="card h-100">
                    <div class="card-body">
                        <a href="{{ product.pageUrl('shop/product') }}">
                            {% if product.images is not empty %}
                                <img class="img-fluid mb-2"
                                    src="{{ product.images.first|resize(0, 160, { mode: 'auto' }) }}"
                                    alt="{{ product.name }}" />
                            {% endif %}
                            <h5>{{ product.name }}</h5>
                        </a>
                        <p>{{ product.final_sale_price|currency }}</p>

                        <button
                            data-request="onAddToCart"
                            data-request-data="{ product_baseid: '{{ product.baseid }}' }"
                            data-request-update="{ 'shop/mini-cart': '#miniCart' }"
                            data-request-flash
                            class="btn btn-primary btn-sm">
                            Add to Cart
                        </button>

                        <a href="javascript:;"
                            data-request="onRemoveFromCart"
                            data-request-data="{
                                key: '{{ item.key }}',
                                cart_name: 'wishlist'
                            }"
                            data-request-update="{ 'shop/wishlist-items': '#wishlistItems' }"
                            class="btn btn-link btn-sm">
                            Remove
                        </a>
                    </div>
                </div>
            </div>
        {% endfor %}
    </div>
{% else %}
    <p>Your wishlist is empty.</p>
{% endif %}
```

## Wishlist Page

Create a dedicated page for the wishlist:

```twig
{# pages/shop/wishlist.htm #}
##
url = "/shop/wishlist"
layout = "default"
title = "My Wishlist"

[cart]
==
<div class="container">
    <h1>My Wishlist</h1>
    <div id="wishlistItems">
        {% partial 'shop/wishlist-items' %}
    </div>
</div>
```

## Wishlist Count in Navigation

Show the number of wishlist items in your site header:

```twig
{# partials/shop/wishlist-count.htm #}
<a href="{{ 'shop/wishlist'|page }}">
    <i class="bi bi-heart"></i>
    {% if cart.totalItems %}
        <span class="badge">{{ cart.totalItems }}</span>
    {% endif %}
</a>
```

## Moving Items Between Cart and Wishlist

The `onUpdateCart` handler supports an `item_postponed` parameter that toggles items between active and postponed status within the same cart. However, for a true wishlist pattern (separate named carts), moving items between the cart and wishlist requires two operations:

**Move from wishlist to cart:**

1. Add the product to the main cart using `onAddToCart` (without `cart_name`).
2. Remove the item from the wishlist using `onRemoveFromCart` with `cart_name: 'wishlist'`.

You can accomplish this with a single button by chaining the operations, or by implementing a custom AJAX handler in your theme's code section.

**Move from cart to wishlist:**

1. Add the product to the wishlist using `onAddToCart` with `cart_name: 'wishlist'`.
2. Remove the item from the main cart using `onRemoveFromCart` (without `cart_name`).

## Guest vs Logged-In Behavior

Wishlist items follow the same storage rules as the main cart:

- **Guest customers** — Wishlist items are stored in the session and will be lost when the session expires.
- **Logged-in customers** — Wishlist items are stored in the database and persist across sessions and devices.

When a guest customer logs in, their session-based wishlist is merged with any existing database wishlist, just like the main cart.

::: tip
If you want the wishlist to be available only to logged-in customers, wrap the wishlist buttons in a session check and redirect guests to the login page.
:::

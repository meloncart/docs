---
subtitle: Manage shopping cart.
---
# Cart

The `cart` component provides shopping cart functionality for your storefront. It handles adding products, updating quantities, removing items, and estimating shipping rates — all through AJAX handlers that can update page partials without a full reload.

## Component Declaration

```ini
[cart]
```

The Cart component has no configurable properties. Add it to any page or layout where you need cart functionality.

## Twig API

The following methods are available on the `cart` component in your Twig templates.

### cart.totalItems()

Returns the total quantity of active (non-postponed) items in the cart.

```twig
{% if cart.totalItems %}
    <span class="badge">{{ cart.totalItems }}</span>
{% endif %}
```

### cart.totalPrice()

Returns the total price of all active cart items, including tax, as an integer in cents.

```twig
<span>{{ cart.totalPrice|currency }}</span>
```

### cart.listActiveItems()

Returns a `CartItemCollection` containing all active items (items not saved for later).

```twig
{% set items = cart.listActiveItems %}
{% for item in items %}
    <p>{{ item.product.name }} — {{ item.final_line_price|currency }}</p>
{% endfor %}
```

### cart.listPostponedItems()

Returns a `CartItemCollection` containing all postponed (saved for later) items.

```twig
{% set savedItems = cart.listPostponedItems %}
{% for item in savedItems %}
    <p>{{ item.product.name }}</p>
{% endfor %}
```

### cart.isCartEmpty()

Returns `true` if the cart has no items (active or postponed).

## AJAX Handlers

### onAddToCart

Adds a product to the cart. This is the primary handler for product pages and quick-add buttons.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `product_baseid` | string | Yes | The base identifier of the product to add |
| `product_cart_quantity` | integer | No | Quantity to add (default: `1`) |
| `product_options[]` | array | No | Selected product options as `optionHash => value` pairs |
| `product_extras[]` | array | No | Selected extras as `extraHash => 1` pairs |
| `item_data[]` | array | No | Custom data fields (keys must start with `x_`) |
| `cart_name` | string | No | Target cart name (default: `main`) |

**Quick-add from a product card** — passes only the product ID:

```html
<button
    data-request="onAddToCart"
    data-request-data="{ product_baseid: '{{ product.baseid }}' }"
    data-request-update="{ 'shop/mini-cart': '#miniCart' }"
    data-request-flash>
    Add to Cart
</button>
```

**Full product page form** — includes quantity and options:

```html
<form>
    {% for option in product.options %}
        <label>{{ option.name }}</label>
        <select name="product_options[{{ option.hash }}]">
            {% for value in option.values %}
                <option value="{{ value.hash }}">{{ value.value }}</option>
            {% endfor %}
        </select>
    {% endfor %}

    {% for extra in product.all_extras %}
        <label>
            <input type="checkbox"
                name="product_extras[{{ extra.hash }}]"
                value="1" />
            {{ extra.description }} (+{{ extra.price|currency }})
        </label>
    {% endfor %}

    <div data-control="quantity-input" class="input-group control-quantity-input">
        <input type="button" value="-" class="btn btn-sm button-minus" />
        <input class="quantity-field form-control-sm" type="number"
            min="1" max="10"
            name="product_cart_quantity" value="1" />
        <input type="button" value="+" class="btn btn-sm button-plus" />
    </div>

    <button
        data-request="onAddToCart"
        data-request-update="{ 'shop/mini-cart': '#miniCart' }"
        data-request-flash>
        Add to Cart
    </button>
</form>
```

::: tip
When a product with the same options and extras is already in the cart, the quantity is increased rather than creating a duplicate entry.
:::

### onRemoveFromCart

Removes a single item from the cart by its key.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | string | Yes | The cart item key to remove |

```html
<a href="javascript:;"
    data-request="onRemoveFromCart"
    data-request-confirm="Remove this item from your cart?"
    data-request-data="{ key: '{{ item.key }}' }"
    data-request-update="{ 'shop/cart-view': '#cartPartial', 'shop/mini-cart': '#miniCart' }">
    Remove
</a>
```

### onUpdateCart

Updates quantities, removes items, and toggles postponed status for multiple cart items at once.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `item_quantity[]` | array | No | Updated quantities as `key => quantity` pairs |
| `delete_item[]` | array | No | Item keys to remove |
| `item_postponed[]` | array | No | Postponed status as `key => bool` pairs |

```html
<form>
    {% for item in items %}
        <input type="number"
            name="item_quantity[{{ item.key }}]"
            value="{{ item.quantity }}"
            min="1" max="10" />
    {% endfor %}

    <button
        data-request="onUpdateCart"
        data-request-update="{ 'shop/cart-view': '#cartPartial', 'shop/mini-cart': '#miniCart' }">
        Update Cart
    </button>
</form>
```

### onEstimateShippingRates

Calculates available shipping methods and their rates for the given location. Returns the estimated options as page variables.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `country_id` | integer | Yes | Country ID for the estimate |
| `state_id` | integer | No | State ID for the estimate |
| `zip` | string | Yes | Postal code for the estimate |

```html
<div class="shipping-estimator">
    <select name="country_id">
        <!-- Country options -->
    </select>
    <select name="state_id">
        <!-- State options -->
    </select>
    <input name="zip" type="text" placeholder="Zip Code" />

    <button
        data-request="onEstimateShippingRates"
        data-request-update="{ 'shop/shipping-estimator': '#shippingEstimateOptions' }"
        data-request-data="{ showing_options: true }">
        Estimate
    </button>
</div>
```

After the request completes, the updated partial receives an `availableOptions` variable containing the shipping methods with their quotes:

```twig
{% if availableOptions is not empty %}
    <ul>
        {% for option in availableOptions %}
            <li>
                {{ option.name }} —
                {% if option.isFree %}
                    Free
                {% else %}
                    {{ option.quote|currency }}
                {% endif %}
            </li>
        {% endfor %}
    </ul>
{% else %}
    <p>No shipping options available for your location.</p>
{% endif %}
```

## CartItem Properties

Each item in the cart is a `CartItem` object. These are the properties available in Twig templates.

### Identifiers

| Property | Type | Description |
| --- | --- | --- |
| `key` | string | Unique 32-character key identifying this cart entry |
| `cartName` | string | The cart this item belongs to (default: `main`) |
| `quantity` | integer | Number of units |
| `postponed` | boolean | Whether the item is saved for later |

### Related Models

| Property | Type | Description |
| --- | --- | --- |
| `product` | Product | The product model |
| `variant` | ProductVariant\|null | The selected variant, if applicable |
| `options` | array | Collection of selected ProductOption objects |
| `extras` | array | Collection of selected ProductExtra objects |
| `customData` | array | Custom data fields (keys starting with `x_`) |

### Price Properties

All prices are integers in cents.

| Property | Type | Description |
| --- | --- | --- |
| `original_price` | integer | Single unit price before discounts, without tax |
| `original_line_price` | integer | `original_price × quantity` |
| `unit_price` | integer | Single unit price after discounts, without tax |
| `unit_line_price` | integer | `unit_price × quantity` |
| `final_price` | integer | Single unit price after discounts, with tax |
| `final_line_price` | integer | `final_price × quantity` |
| `discount` | integer | Per-unit discount amount without tax |
| `final_discount` | integer | Per-unit discount amount with tax |

### Weight and Dimensions

| Property | Type | Description |
| --- | --- | --- |
| `total_weight` | float | Total weight (unit weight × quantity) |
| `total_volume` | float | Total volume (unit volume × quantity) |
| `total_depth` | float | Total depth |
| `total_width` | float | Total width |
| `total_height` | float | Total height |

## CartItemCollection Methods

The collections returned by `cart.listActiveItems()` and `cart.listPostponedItems()` are `CartItemCollection` instances that provide aggregate methods.

| Method | Return | Description |
| --- | --- | --- |
| `totalQuantity()` | integer | Sum of all item quantities |
| `totalPrice()` | integer | Total price with tax |
| `totalPriceNoTax()` | integer | Total price without tax |
| `totalTax()` | integer | Total tax amount |
| `totalCost()` | integer | Total cost price |
| `totalDiscount()` | integer | Sum of all discounts |
| `totalDiscountWithTax()` | integer | Sum of discounts with tax |
| `totalWeight()` | float | Sum of all item weights |
| `totalVolume()` | float | Sum of all item volumes |

All aggregate methods exclude postponed items.

## Cart Storage

How cart data is stored depends on whether the customer is logged in:

- **Guest customers** — Cart items are stored in the session (`SessionCart`). If the session expires, the cart is lost.
- **Logged-in customers** — Cart items are stored in the database (`UserCart`), persisting across sessions and devices.

When a guest customer logs in, their session cart is merged with any existing database cart automatically.

## Named Carts

The cart system supports multiple named carts. The default cart is named `main`. You can target a different cart by passing the `cart_name` parameter to AJAX handlers:

```html
<button
    data-request="onAddToCart"
    data-request-data="{
        product_baseid: '{{ product.baseid }}',
        cart_name: 'wishlist'
    }">
    Save for Later
</button>
```

Named carts are the mechanism behind the [Wishlist](./wishlist) feature. See the wishlist documentation for the full pattern.

## Complete Examples

### Mini Cart

A compact cart indicator for the site header, showing the item count with a link to the cart page:

```twig
{# partials/shop/mini-cart.htm #}
[cart]
==
<a href="{{ 'shop/cart'|page }}" class="text-reset text-decoration-none">
    <div class="text-center position-relative d-inline-block">
        <i class="bi bi-cart2 fs-4"></i>
        {% if cart.totalItems %}
            <span class="translate-middle badge rounded-pill bg-danger">
                {{ cart.totalItems }}
            </span>
        {% endif %}
    </div>
</a>
```

### Cart Page

A full cart page with item list, quantity controls, and order summary:

```twig
{# pages/shop/cart.htm #}
##
url = "/shop/cart"
layout = "default"
title = "Cart"

[cart]
==
<div class="container">
    <form id="cartPartial">
        {% partial 'shop/cart-view' %}
    </form>
</div>
```

```twig
{# partials/shop/cart-view.htm #}
{% set items = cart.listActiveItems %}

{% if items is not empty %}
    <div class="row">
        <div class="col-md-8">
            <h3>My Cart</h3>
            <ul class="list-group list-group-flush">
                {% for item in items %}
                    {% set product = item.product %}
                    <li class="list-group-item">
                        <div class="row align-items-center">
                            <div class="col-2">
                                <a href="{{ product.pageUrl('shop/product') }}">
                                    {% if product.images is not empty %}
                                        <img class="img-fluid"
                                            src="{{ product.images.first|resize(0, 100, { mode: 'auto' }) }}"
                                            alt="{{ product.name }}" />
                                    {% endif %}
                                </a>
                            </div>
                            <div class="col-5">
                                <a href="{{ product.pageUrl('shop/product') }}">
                                    <h5>{{ product.name }}</h5>
                                </a>
                                {% for option in item.options %}
                                    {{ option.name }}: {{ option.value }}{{ not loop.last ? ', ' }}
                                {% endfor %}
                                {% for extra in item.extras %}
                                    <br />+ {{ extra.description }}
                                {% endfor %}
                                <div class="small mt-1">
                                    {% if item.final_discount > 0 %}
                                        <span class="text-success">{{ (item.final_price - item.final_discount)|currency }}</span>
                                        <span class="text-decoration-line-through text-muted">{{ item.final_price|currency }}</span>
                                    {% else %}
                                        <span>{{ item.final_price|currency }}</span>
                                    {% endif %}
                                </div>
                            </div>
                            <div class="col-3">
                                <div data-control="quantity-input" class="input-group control-quantity-input">
                                    <input type="button" value="-" class="btn btn-sm button-minus" />
                                    <input class="quantity-field form-control-sm"
                                        type="number" min="1" max="10"
                                        name="item_quantity[{{ item.key }}]"
                                        value="{{ item.quantity }}" />
                                    <input type="button" value="+" class="btn btn-sm button-plus" />
                                </div>
                                <div class="mt-2 small text-center">
                                    <a href="javascript:;"
                                        data-request="onRemoveFromCart"
                                        data-request-confirm="Remove this item?"
                                        data-request-data="{ key: '{{ item.key }}' }"
                                        data-request-update="{ 'shop/cart-view': '#cartPartial', 'shop/mini-cart': '#miniCart' }">
                                        Remove
                                    </a>
                                </div>
                            </div>
                            <div class="col-2 text-end">
                                {{ item.final_line_price|currency }}
                            </div>
                        </div>
                    </li>
                {% endfor %}
            </ul>
            <div class="text-end mt-2">
                <button
                    data-request="onUpdateCart"
                    data-request-update="{ 'shop/cart-view': '#cartPartial', 'shop/mini-cart': '#miniCart' }"
                    class="btn btn-link">
                    Update Cart
                </button>
            </div>
        </div>
        <div class="col-md-4">
            <h3>Order Summary</h3>
            <div class="d-flex justify-content-between">
                <span>Subtotal</span>
                <span class="fw-bold">{{ cart.totalPrice|currency }}</span>
            </div>
            <a href="{{ 'shop/checkout'|page }}" class="btn btn-success btn-lg w-100 mt-3">
                Checkout
            </a>
        </div>
    </div>
{% else %}
    <h3>My Cart</h3>
    <p>Your shopping cart is empty.</p>
    <a href="{{ 'shop/index'|page }}" class="btn btn-primary">Continue Shopping</a>
{% endif %}
```

### Shipping Estimator

A collapsible shipping rate estimator for the cart page:

```twig
{# partials/shop/shipping-estimator.htm #}
{% if not post('showing_options') %}
    <button type="button" class="btn btn-link"
        data-bs-toggle="collapse"
        data-bs-target=".estimator-collapse">
        Estimate Shipping Cost
    </button>

    <div class="estimator-collapse collapse">
        <div class="row g-3">
            <div class="col-3">
                <select name="country_id" class="form-select">
                    <!-- Country options -->
                </select>
            </div>
            <div class="col-4">
                <select name="state_id" class="form-select">
                    <!-- State options -->
                </select>
            </div>
            <div class="col-2">
                <input name="zip" type="text" class="form-control" placeholder="Zip Code" />
            </div>
            <div class="col-3">
                <button class="btn btn-primary"
                    data-request="onEstimateShippingRates"
                    data-request-update="{ 'shop/shipping-estimator': '#shippingEstimateOptions' }"
                    data-request-data="{ showing_options: true }">
                    Estimate
                </button>
            </div>
        </div>
    </div>
    <div id="shippingEstimateOptions"></div>
{% else %}
    {% if availableOptions is not empty %}
        <p>Available shipping options:</p>
        <ul class="list-group">
            {% for option in availableOptions %}
                <li class="list-group-item d-flex justify-content-between">
                    <span>{{ option.name }}</span>
                    <span>{% if option.isFree %}Free{% else %}{{ option.quote|currency }}{% endif %}</span>
                </li>
            {% endfor %}
        </ul>
    {% else %}
        <p>No shipping options available for your location.</p>
    {% endif %}
{% endif %}
```

## Events

The cart system fires several events that you can listen to in your plugins. See the [Events](../hooks/events) documentation for the complete list, including:

- `shop.cart.beforeAddProduct` — Before an item is added to the cart.
- `shop.cart.addProduct` — After an item is added.
- `shop.cart.beforeRemoveItem` — Before an item is removed.
- `shop.cart.beforeSetQuantity` / `shop.cart.setQuantity` — Before and after quantity changes.
- `shop.cart.getPrice` — Override item price calculations.
- `shop.cart.processCustomData` — Modify custom data during add-to-cart.

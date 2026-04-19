---
subtitle: Build your first storefront in 5 minutes.
---
# Quick Start

This tutorial walks through building a minimal storefront with Meloncart, from scratch, with no theme dependencies. By the end you'll have a product listing, a product page with add-to-cart, a cart, and a working checkout.

::: tip Prerequisites
Install Meloncart and its dependencies first. See the [Installation Guide](/developer/installation) for details. You'll also need at least one product and one payment method configured in the backend.
:::

## 1. Product Listing Page

Create a page that lists all products using the **Catalog** component.

```ini
url = "/shop"

[catalog]
lookup = "category"
```

```twig
{% set products = catalog.productQuery.listFrontEnd() %}

<h1>
    Shop
</h1>

<div class="row">
    {% for product in products %}
        <div class="col-md-4 mb-4">
            <div class="card">
                {% if product.images.first %}
                    <img src="{{ product.images.first.thumb(300, 300) }}" class="card-img-top" />
                {% endif %}
                <div class="card-body">
                    <h5>
                        {{ product.name }}
                    </h5>
                    <p>
                        {{ product.display_price|currency }}
                        {% if product.on_sale %}
                            <s class="text-muted">
                                {{ product.compare_price|currency }}
                            </s>
                        {% endif %}
                    </p>
                    <a href="{{ product.url }}" class="btn btn-primary">
                        View
                    </a>
                </div>
            </div>
        </div>
    {% endfor %}
</div>
```

Key points:
- `catalog.productQuery` returns a new Product query: call `listFrontEnd()` to get a paginated collection of visible products
- `product.display_price` is the best price for the customer, automatically adjusted for your store's [tax display settings](/developer/models/pricing#tax-display)
- `product.compare_price` is the original/strikethrough price shown when `product.on_sale` is `true`
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

<h1>
    {{ product.name }}
</h1>

{% if product.images.first %}
    <img src="{{ product.images.first.thumb(400, 400) }}" class="mb-3" />
{% endif %}

<p class="fs-4">
    {{ product.display_price|currency }}
    {% if product.on_sale %}
        <s class="text-muted">
            {{ product.compare_price|currency }}
        </s>
    {% endif %}
</p>

{{ product.description_html|raw }}

<form data-request="cart::onAddToCart" data-request-flash>
    <input type="hidden" name="product_baseid" value="{{ product.baseid }}" />
    <input type="number" name="product_cart_quantity" value="1" min="1" class="form-control w-auto mb-3" />
    <button type="submit" class="btn btn-primary" data-attach-loading>
        Add to Cart
    </button>
</form>

{% if product.in_stock %}
    <span class="badge bg-success">
        In Stock
    </span>
{% else %}
    <span class="badge bg-danger">
        Out of Stock
    </span>
{% endif %}
```

Key points:
- `product.in_stock` is a convenience boolean for inventory status
- The `cart::onAddToCart` handler adds the product to the session cart
- For products with variants and options, see the [Catalog Component](/developer/components/catalog) guide

## 3. Cart Page

Create a cart page to review items before checkout.

```ini
url = "/shop/cart"

[cart]
```

```twig
{% set items = cart.items %}

<h1>
    Your Cart
</h1>

{% if items is empty %}
    <p>
        Your cart is empty.
    </p>
{% else %}
    <table class="table">
        <thead>
            <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {% for item in items %}
                <tr>
                    <td>
                        {{ item.name }}
                    </td>
                    <td>
                        {{ item.display_price|currency }}
                    </td>
                    <td>
                        {{ item.quantity }}
                    </td>
                    <td>
                        {{ item.display_line_price|currency }}
                    </td>
                    <td>
                        <button
                            class="btn btn-sm btn-danger"
                            data-request="cart::onRemoveFromCart"
                            data-request-data="{ item_key: '{{ item.key }}' }"
                            data-request-confirm="Remove this item?"
                        >
                            Remove
                        </button>
                    </td>
                </tr>
            {% endfor %}
        </tbody>
    </table>

    <p class="fs-5">
        Total: {{ cart.totalPrice|currency }}
    </p>

    <a href="{{ 'shop/checkout'|page }}" class="btn btn-primary">
        Proceed to Checkout
    </a>
{% endif %}
```

Key points:
- `item.display_price` and `item.display_line_price` use the same pricing vocabulary as Product
- `cart::onRemoveFromCart` removes an item by its `item.key`

## 4. Checkout Page

The checkout uses the **Checkout** component. This minimal example collects contact details, selects a shipping and payment method, and places the order, all in a single form. The **Location** component provides the country and state dropdowns.

```ini
url = "/shop/checkout"

[checkout]

[location]
```

```twig
<h1>
    Checkout
</h1>

{% if checkout.isCartEmpty %}
    <p>
        Your cart is empty.
    </p>
{% else %}
    <form>
        <!-- Contact Details -->
        <h3>
            Contact Details
        </h3>
        <div class="row mb-3">
            <div class="col-md-6">
                <label class="form-label">First Name</label>
                <input type="text" name="first_name" value="{{ address.first_name }}" class="form-control" />
            </div>
            <div class="col-md-6">
                <label class="form-label">Last Name</label>
                <input type="text" name="last_name" value="{{ address.last_name }}" class="form-control" />
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" name="email" value="{{ address.email }}" class="form-control" />
        </div>
        <div class="mb-3">
            <label class="form-label">Address</label>
            <input type="text" name="address_line1" value="{{ address.address_line1 }}" class="form-control" />
        </div>
        <div class="row mb-3">
            <div class="col-md-4">
                <label class="form-label">City</label>
                <input type="text" name="city" value="{{ address.city }}" class="form-control" />
            </div>
            <div class="col-md-4">
                <label class="form-label">ZIP / Postcode</label>
                <input type="text" name="zip" value="{{ address.zip }}" class="form-control" />
            </div>
            <div class="col-md-4">
                <label class="form-label">Country</label>
                {% partial 'location::form-select-country' countryId=address.country_id %}
            </div>
        </div>
        <div class="mb-3" id="stateControlSelector">
            <label class="form-label">State / Region</label>
            {% partial 'location::form-select-state' countryId=address.country_id stateId=address.state_id %}
        </div>

        <!-- Shipping Method -->
        {% if shippingRequired and shippingMethods %}
            <h3>
                Shipping Method
            </h3>
            {% for method in shippingMethods %}
                <div class="form-check mb-2">
                    <input
                        class="form-check-input"
                        type="radio"
                        name="shipping_method"
                        id="shipping_{{ method.id }}"
                        value="{{ method.id }}"
                        {{ shippingMethod.id == method.id ? 'checked' }}
                    />
                    <label class="form-check-label" for="shipping_{{ method.id }}">
                        {{ method.name }} &mdash; {{ method.quote|currency }}
                    </label>
                </div>
            {% endfor %}
        {% endif %}

        <!-- Payment Method -->
        {% if paymentMethods is not empty %}
            <h3>
                Payment Method
            </h3>
            {% for method in paymentMethods %}
                <div class="form-check mb-2">
                    <input
                        class="form-check-input"
                        type="radio"
                        name="payment_method"
                        id="payment_{{ method.id }}"
                        value="{{ method.id }}"
                        {{ paymentMethod.id == method.id ? 'checked' }}
                    />
                    <label class="form-check-label" for="payment_{{ method.id }}">
                        {{ method.name }}
                    </label>
                </div>
            {% endfor %}
        {% endif %}

        <!-- Order Summary -->
        <h3>
            Order Summary
        </h3>
        <table class="table">
            {% for item in items %}
                <tr>
                    <td>
                        {{ item.name }} &times; {{ item.quantity }}
                    </td>
                    <td class="text-end">
                        {{ item.display_line_price|currency }}
                    </td>
                </tr>
            {% endfor %}
            <tr class="fw-bold">
                <td>
                    Total
                </td>
                <td class="text-end">
                    {{ order.total|currency }}
                </td>
            </tr>
        </table>

        <!-- Submit -->
        <input type="hidden" name="post_contact_details" value="1" />
        <input type="hidden" name="post_shipping_method" value="1" />
        <input type="hidden" name="post_payment_method" value="1" />

        <button
            type="submit"
            class="btn btn-primary btn-lg"
            data-request="checkout::onPlaceOrder"
            data-request-flash
            data-attach-loading
        >
            Place Order
        </button>
    </form>
{% endif %}
```

Key points:
- The hidden `post_*` fields tell the checkout component which data to process. All fields are submitted in a single request
- `onPlaceOrder` validates the form, creates the order, and redirects to the payment page
- The contact address doubles as both billing and shipping address by default
- `location::form-select-country` and `location::form-select-state` are built-in component partials from RainLab.Location. Selecting a country automatically refreshes the state dropdown via AJAX
- For a multi-step checkout experience, see the [Checkout Component](/developer/components/checkout) guide

## 5. Payment Page

After the order is placed, the customer is redirected to a payment page. Create this page using the **Payment** component from the Responsiv.Pay plugin.

```ini
url = "/shop/payment/:hash"

[payment]
isDefault = 1
```

```twig
{% set order = invoice.related %}

{% if invoice.is_paid %}
    <h1>
        Thank You!
    </h1>
    <p>
        Your order #{{ order.order_number }} is confirmed and payment has been received.
    </p>
{% else %}
    <h1>
        Complete Payment
    </h1>
    <p>
        Order #{{ order.order_number }}
    </p>

    {% if invoice.payment_method %}
        {{ invoice.payment_method.renderPaymentForm(this.controller)|raw }}
    {% endif %}
{% endif %}
```

::: tip
Make sure your payment method is configured with this page as its **Payment Page** in the backend under Settings &rarr; Payments.
:::

## Next Steps

- [Pricing](/developer/models/pricing): understand how `display_price`, `compare_price`, and tax display work
- [Catalog Component](/developer/components/catalog): full filtering, sorting, and search API
- [Cart Component](/developer/components/cart): cart management, shipping estimates, named carts
- [Checkout Component](/developer/components/checkout): multi-step checkout customization
- [Events](/developer/hooks/events): extend the order lifecycle, stock management, and more
- [Price Rules](/developer/extending/price-rules): build custom discount logic

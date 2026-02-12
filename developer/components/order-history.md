---
subtitle: Display customer order history.
---
# Order History

Meloncart does not require a dedicated order history component. Instead, customer orders are accessed through the `user.orders` relationship that Meloncart adds to the User model. Combined with the [Session](./session) component for authentication, you can build complete order list and order detail pages using only Twig.

## How It Works

When the Meloncart plugin is installed, it extends the RainLab.User model with a `hasMany` relationship to the Order model:

```php
$user->hasMany['orders'] = [
    \Meloncart\Shop\Models\Order::class,
    'order' => 'id desc'
];
```

This means any page that has access to the authenticated `user` object (via the [Session](./session) component) can access the customer's orders through `user.orders`.

## Order Model Properties

### Core Properties

| Property | Type | Description |
| --- | --- | --- |
| `id` | integer | Order ID |
| `baseid` | string | URL-safe base identifier |
| `orderNumber` | string | Display-formatted order number |
| `ordered_at` | Carbon | When the order was placed |
| `status_updated_at` | Carbon | When the status was last changed |
| `user_notes` | string | Customer notes submitted during checkout |

### Financial Properties

All prices are integers in cents.

| Property | Type | Description |
| --- | --- | --- |
| `total` | integer | Grand total including tax and shipping |
| `subtotal` | integer | Subtotal before tax and shipping |
| `discount` | integer | Discount amount |
| `total_tax` | integer | Total tax amount |
| `shipping_quote` | integer | Shipping cost |
| `shipping_tax` | integer | Tax on shipping |

### Status

| Property | Type | Description |
| --- | --- | --- |
| `status` | OrderStatus | Current order status |
| `status.name` | string | Status display name (e.g., "Paid", "Shipped") |
| `status.code` | string | Status code (e.g., `new`, `paid`, `shipped`) |
| `status.color_background` | string | Background color hex code for badges |
| `status.color_foreground` | string | Text color hex code for badges |

### Payment

| Property | Type | Description |
| --- | --- | --- |
| `is_payment_processed` | boolean | Whether payment has been confirmed |
| `payment_processed_at` | Carbon\|null | When payment was confirmed |
| `payment_method` | PaymentMethod | Payment method used |
| `invoice` | Invoice\|null | Associated invoice record |

### Shipping Address

| Property | Type | Description |
| --- | --- | --- |
| `shipping_first_name` | string | First name |
| `shipping_last_name` | string | Last name |
| `shipping_company` | string | Company name |
| `shipping_phone` | string | Phone number |
| `shipping_address_line1` | string | Street address line 1 |
| `shipping_address_line2` | string | Street address line 2 |
| `shipping_city` | string | City |
| `shipping_zip` | string | Postal code |
| `shipping_state` | State | State/province relationship |
| `shipping_country` | Country | Country relationship |
| `shipping_method` | ShippingMethod | Shipping method selected |

### Billing Address

| Property | Type | Description |
| --- | --- | --- |
| `billing_first_name` | string | First name |
| `billing_last_name` | string | Last name |
| `billing_company` | string | Company name |
| `billing_email` | string | Email address |
| `billing_phone` | string | Phone number |
| `billing_address_line1` | string | Street address line 1 |
| `billing_address_line2` | string | Street address line 2 |
| `billing_city` | string | City |
| `billing_zip` | string | Postal code |
| `billing_state` | State | State/province relationship |
| `billing_country` | Country | Country relationship |

### Relationships

| Property | Type | Description |
| --- | --- | --- |
| `items` | Collection | Order line items |
| `status_log` | Collection | Status change history |
| `tracking_codes` | Collection | Shipment tracking codes |
| `notes` | Collection | Admin notes |

### Methods

| Method | Return | Description |
| --- | --- | --- |
| `isPaymentProcessed()` | boolean | Whether payment is confirmed |
| `getIsShipped()` | boolean | Whether the order has tracking codes |
| `getLatestTrackingCode()` | OrderTrackingCode\|null | Most recent tracking code |
| `getCustomerVisibleNotes()` | Collection | Notes visible to the customer |

## OrderItem Properties

Each item in `order.items` is an `OrderItem` with these properties:

| Property | Type | Description |
| --- | --- | --- |
| `product` | Product | The product model |
| `variant` | ProductVariant\|null | Selected variant, if applicable |
| `quantity` | integer | Number of units ordered |
| `price` | integer | Unit price |
| `unit_price` | integer | Unit price after discounts |
| `unit_line_price` | integer | `unit_price × quantity` |
| `discount` | integer | Discount amount |
| `total` | integer | Line total with tax |
| `options_data` | array | Selected product options |
| `extras_data` | array | Selected extras |

### OrderItem Methods

| Method | Return | Description |
| --- | --- | --- |
| `outputProductName()` | string | Formatted name with options and extras |

## OrderTrackingCode Properties

Each tracking code in `order.tracking_codes` has:

| Property | Type | Description |
| --- | --- | --- |
| `carrier` | string | Carrier code (`fedex`, `ups`, `usps`, `dhl`, `other`) |
| `tracking_number` | string | Tracking number |
| `shipped_at` | Carbon | Date shipped |
| `tracking_url` | string\|null | Auto-generated tracking URL for the carrier |

## Complete Examples

### Order List Page

```twig
{# pages/account/orders.htm #}
##
url = "/account/orders"
layout = "account"
title = "Orders"

[session]
security = "user"
redirect = "account/login"
==
<div class="page-account">
    <h2 class="mb-4">My Orders</h2>

    {% set orders = user.orders %}
    {% do orders.load('status') %}
    {% if orders is not empty %}
        <div class="table-responsive border-0">
            <table class="table mb-0 text-nowrap table-centered">
                <thead>
                    <tr>
                        <th>Order</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {% for order in orders %}
                        {% set url = 'account/order'|page({ id: order.id }) %}
                        <tr>
                            <td class="align-middle border-top-0">
                                <a href="{{ url }}">#{{ order.orderNumber }}</a>
                            </td>
                            <td class="align-middle border-top-0">
                                {{ order.ordered_at|date('j M Y') }}
                            </td>
                            <td class="align-middle border-top-0">
                                <span class="badge"
                                    style="background:{{ order.status.color_background }}">
                                    {{ order.status.name }}
                                </span>
                            </td>
                            <td class="align-middle border-top-0">
                                {{ order.total|currency }}
                            </td>
                            <td class="text-muted align-middle border-top-0">
                                <a href="{{ url }}" class="text-inherit">
                                    <i class="bi bi-eye"></i>
                                </a>
                            </td>
                        </tr>
                    {% endfor %}
                </tbody>
            </table>
        </div>
    {% else %}
        <div class="text-center">
            <p>No orders yet</p>
            <a href="{{ 'shop/index'|page }}" class="btn btn-outline-primary mt-2">
                Continue shopping
            </a>
        </div>
    {% endif %}
</div>
```

::: tip
Use `{% do orders.load('status') %}` to eager-load the status relationship and avoid N+1 queries when iterating over orders.
:::

### Order Detail Page

```twig
{# pages/account/order.htm #}
##
url = "/account/order/:id"
layout = "account"
title = "Order"

[session]
security = "user"
redirect = "account/login"
==
{% set order = user.orders().find(this.param.id) %}
{% if not order %}
    {% do abort(404) %}
{% endif %}

<div class="mb-3">
    <a href="{{ 'account/orders'|page }}" class="btn btn-link ps-0 text-reset text-decoration-none">
        <i class="bi bi-chevron-left"></i> Back to Orders
    </a>
</div>

<div class="page-account">
    <div class="row align-items-center mb-3">
        <div class="col-4">
            <h2 class="m-0">Order #{{ order.orderNumber }}</h2>
        </div>
        <div class="col-8 text-end">
            <p class="text-muted m-0">
                {{ order.ordered_at.format('F n, Y') }}
                at {{ order.ordered_at.format('h:ia') }}
            </p>
        </div>
    </div>

    <div class="py-3">
        {% partial 'shop/order-items' items=order.items %}
    </div>

    {% if not order.is_payment_processed %}
        <div class="card mb-2">
            <div class="card-body py-2">
                <div class="d-flex align-items-center">
                    <div class="pe-4">
                        <i class="bi bi-bag-x text-danger" style="font-size:32px"></i>
                    </div>
                    <div>
                        <h5 class="cart-title m-0">This Order is Unpaid</h5>
                    </div>
                    <div class="ms-auto">
                        {% if order.invoice %}
                            <a
                                href="{{ 'shop/payment'|page({ hash: order.invoice.hash }) }}"
                                class="btn btn-dark">
                                Pay Now
                            </a>
                        {% endif %}
                    </div>
                </div>
            </div>
        </div>
    {% endif %}

    <div class="card mb-2">
        <div class="card-body pb-0">
            <div class="row">
                <div class="col-6">
                    <h5 class="fw-bold">Shipping Address</h5>
                    <p>
                        {{ order.shipping_first_name }} {{ order.shipping_last_name }}<br />
                        {{ order.shipping_address_line1 }}<br />
                        {% if order.shipping_address_line2 %}
                            {{ order.shipping_address_line2 }}<br />
                        {% endif %}
                        {{ order.shipping_city }}
                        {{ order.shipping_state.code }}
                        {{ order.shipping_zip }}<br />
                        {{ order.shipping_country.name }}<br />
                        {{ order.shipping_phone }}
                    </p>
                </div>
                <div class="col-6">
                    <h5 class="fw-bold">Billing Address</h5>
                    <p>
                        {{ order.billing_first_name }} {{ order.billing_last_name }}<br />
                        {{ order.billing_address_line1 }}<br />
                        {% if order.billing_address_line2 %}
                            {{ order.billing_address_line2 }}<br />
                        {% endif %}
                        {{ order.billing_city }}
                        {{ order.billing_state.code }}
                        {{ order.billing_zip }}<br />
                        {{ order.billing_country.name }}<br />
                        {{ order.billing_phone }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
```

::: warning
The order detail page uses `user.orders().find(this.param.id)` to look up the order. This ensures the customer can only access their own orders — not orders belonging to other users.
:::

### Order Items Partial

A reusable partial for displaying order line items with product images and totals:

```twig
{# partials/shop/order-items.htm #}
<ul class="list-group list-group-flush">
    <li class="list-group-item">
        <div class="row align-items-center">
            <div class="col-7"><span>Product</span></div>
            <div class="col-3 text-center"><span>Quantity</span></div>
            <div class="col-2 text-end"><span>Total</span></div>
        </div>
    </li>
    {% for item in items %}
        {% set product = item.product %}
        <li class="list-group-item py-3 border-top">
            <div class="row align-items-center py-3">
                <div class="col-3 col-md-2">
                    <a href="{{ product.pageUrl('shop/product') }}">
                        {% if product.images is not empty %}
                            <img class="img-fluid"
                                src="{{ product.images.first|resize(0, 100, { mode: 'auto' }) }}"
                                alt="{{ product.name }}" />
                        {% endif %}
                    </a>
                </div>
                <div class="col-4 col-md-5">
                    <a href="{{ product.pageUrl('shop/product') }}" class="text-inherit">
                        <h5 class="mb-2">{{ product.name }}</h5>
                    </a>
                    <span class="text-success small">
                        {{ item.unit_price|currency }}
                    </span>
                    {% if item.discount %}
                        <span class="text-decoration-line-through text-muted small">
                            {{ item.price|currency }}
                        </span>
                    {% endif %}
                </div>
                <div class="col-3 text-center">
                    {{ item.quantity }}
                </div>
                <div class="col-2 text-end">
                    <span>{{ item.unit_line_price|currency }}</span>
                </div>
            </div>
        </li>
    {% endfor %}
    <li class="list-group-item py-3 border-top">
        <div class="row align-items-center">
            <div class="col-8 text-end">
                <span>Total</span>
            </div>
            <div class="col-4 text-end">
                <span class="fw-bold fs-5">
                    {{ order.total|currency({ format: 'long' }) }}
                </span>
            </div>
        </div>
    </li>
</ul>
```

### Tracking Information

You can display shipment tracking on the order detail page:

```twig
{% if order.is_shipped %}
    <div class="card mb-2">
        <div class="card-body">
            <h5 class="fw-bold">Shipment Tracking</h5>
            {% for code in order.tracking_codes %}
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div>
                        <strong>{{ code.carrier|upper }}</strong>:
                        {{ code.tracking_number }}
                        <br />
                        <small class="text-muted">
                            Shipped {{ code.shipped_at|date('j M Y') }}
                        </small>
                    </div>
                    {% if code.tracking_url %}
                        <a href="{{ code.tracking_url }}" target="_blank"
                            class="btn btn-outline-primary btn-sm">
                            Track Package
                        </a>
                    {% endif %}
                </div>
            {% endfor %}
        </div>
    </div>
{% endif %}
```

### Status History

Display the order's status change history:

```twig
{% set statusLog = order.status_log %}
{% if statusLog is not empty %}
    <div class="card mb-2">
        <div class="card-body">
            <h5 class="fw-bold">Order History</h5>
            <ul class="list-group list-group-flush">
                {% for log in statusLog %}
                    <li class="list-group-item px-0">
                        <div class="d-flex justify-content-between">
                            <span class="badge"
                                style="background:{{ log.status.color_background }}">
                                {{ log.status.name }}
                            </span>
                            <small class="text-muted">
                                {{ log.created_at|date('j M Y, h:ia') }}
                            </small>
                        </div>
                        {% if log.comment %}
                            <p class="mb-0 mt-1 small">{{ log.comment }}</p>
                        {% endif %}
                    </li>
                {% endfor %}
            </ul>
        </div>
    </div>
{% endif %}
```

### Unpaid Order — Pay Now Link

If an order is unpaid and has an associated invoice, you can link the customer to the payment page:

```twig
{% if not order.is_payment_processed and order.invoice %}
    <a href="{{ 'shop/payment'|page({ hash: order.invoice.hash }) }}"
        class="btn btn-dark">
        Pay Now
    </a>
{% endif %}
```

This redirects to the [Checkout](./checkout) payment page where the customer can complete payment using the invoice hash.

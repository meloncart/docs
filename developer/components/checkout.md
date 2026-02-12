---
subtitle: The checkout process.
---
# Checkout

The `checkout` component manages the entire checkout flow — collecting customer details, selecting shipping and payment methods, placing orders, and processing payments. It stores checkout state in the session and provides AJAX handlers for each step.

## Component Declaration

```ini
[checkout]
```

The Checkout component has no configurable properties. Add it to your checkout page.

## Page Variables

The component sets these page variables on every page load and after each AJAX request. Use them in your Twig templates to display checkout state.

### Order Preview

| Variable | Type | Description |
| --- | --- | --- |
| `order` | Order | A mock order calculated from the current cart and checkout data (not saved to database) |
| `invoice` | Invoice | The mock order's associated invoice |
| `items` | CartItemCollection | Active cart items |

### Contact and Billing

| Variable | Type | Description |
| --- | --- | --- |
| `address` | CheckoutAddress | The customer's contact details |
| `billingAddress` | CheckoutAddress | The billing address (falls back to contact details if not set separately) |
| `paymentMethod` | PaymentMethod\|null | The currently selected payment method |
| `paymentMethods` | Collection | Payment methods available for this order |
| `hasPaymentMethod` | boolean | Whether a payment method is selected |
| `allPaymentMethods` | Collection | All enabled payment methods |

### Shipping

| Variable | Type | Description |
| --- | --- | --- |
| `shippingRequired` | boolean | Whether the cart contains shippable products |
| `shippingMethods` | array | Shipping methods available for the current address |
| `shippingAddress` | CheckoutAddress | The shipping address (falls back to contact details if not set separately) |
| `shippingMethod` | ShippingMethod\|null | The selected shipping method with quote |
| `hasShippingAddress` | boolean | Whether a shipping location has been provided |
| `hasShippingMethod` | boolean | Whether a shipping method is selected |
| `hasShippingQuote` | boolean | Whether both address and method are set (quote is available) |

## Twig API

### checkout.user()

Returns the currently logged-in user, or `null` for guest checkout.

### checkout.isCartEmpty()

Returns `true` if the cart has no items. Use this to show an empty cart message instead of the checkout form.

## AJAX Handlers

### onAction

The generic checkout action handler. It processes any pending checkout step data from the POST request, then refreshes the page variables. This is the primary handler used for navigating between checkout steps.

When called, `onAction` processes all `post_*` flags found in the request (see [POST Parameters](#post-parameters) below), updates the checkout session, and returns the updated page variables for partial rendering.

```html
<button
    data-request="onAction"
    data-request-data="{ checkout_step: 'shipping' }"
    data-request-update="{ 'shop/checkout-view': '#shopCheckoutView' }">
    Continue to Shipping
</button>
```

If the cart contents have changed since the checkout started, `onAction` triggers a page refresh to recalculate totals. If the order has already been paid, it redirects to the receipt page.

### onPlaceOrder

Creates the order, generates an invoice, and redirects the customer to the payment page. This is the final step before payment.

```html
<button
    data-request="checkout::onPlaceOrder"
    class="btn btn-primary btn-lg">
    Place Order
</button>
```

Before creating the order, this handler processes any checkout step data in the request (contact details, addresses, methods). This allows you to submit all checkout data in a single request if desired.

**Returns:** A redirect to the payment page by default. If `no_redirect` is posted, returns a JSON object instead:

```json
{
    "order_hash": "abc123...",
    "invoice_hash": "def456...",
    "return_url": "/shop/payment/def456..."
}
```

| Parameter | Type | Description |
| --- | --- | --- |
| `no_redirect` | boolean | Return JSON instead of redirecting |

### onPrepareOrder

Creates the order without emptying the cart or finalizing. This is used for API integrations where the order may need amendments before payment.

**Returns:** A JSON object:

```json
{
    "order_hash": "abc123...",
    "invoice_hash": "def456..."
}
```

The order hash is stored in the session so subsequent calls to `onPlaceOrder` or `onPrepareOrder` update the existing order rather than creating a new one.

### onPay

Processes the payment form submission on the payment page. This handler is used after the order has been placed and the customer is on the payment page.

| Parameter | Type | Description |
| --- | --- | --- |
| `pay_from_profile` | boolean | Use the customer's stored payment method instead of the posted form data |

```html
{# Standard payment form #}
<form data-request="checkout::onPay">
    <!-- Payment form fields rendered by the payment method driver -->
    <button type="submit">Pay Now</button>
</form>

{# Pay with stored payment method #}
<button
    data-request="checkout::onPay"
    data-request-data="{ pay_from_profile: true }">
    Pay with Stored Card
</button>
```

On successful payment, the customer is redirected to the receipt page. The payment method driver may also return a custom redirect (e.g., to a third-party payment gateway).

## POST Parameters

The checkout component processes POST parameters to update checkout state. Each parameter group is triggered by a corresponding flag.

### Contact Details

Triggered by `post_contact_details = true`.

| Parameter | Type | Description |
| --- | --- | --- |
| `first_name` | string | Customer first name |
| `last_name` | string | Customer last name |
| `email` | string | Email address |
| `phone` | string | Phone number |
| `company` | string | Company name |
| `address_line1` | string | Street address |
| `address_line2` | string | Apartment, suite, etc. |
| `city` | string | City |
| `zip` | string | Postal code |
| `country_id` | integer | Country ID |
| `state_id` | integer | State ID |

### Address Book Preset

Triggered by `post_address_book_preset = true`. Loads a saved address from the customer's address book (requires RainLab.UserPlus).

| Parameter | Type | Description |
| --- | --- | --- |
| `address_book_id` | integer | The saved address ID to load |

### Billing Details

Triggered by `post_billing_details = true`. Uses the same fields as contact details with a `billing_` prefix.

| Parameter | Type | Description |
| --- | --- | --- |
| `billing_first_name` | string | Billing first name |
| `billing_last_name` | string | Billing last name |
| `billing_email` | string | Billing email |
| `billing_phone` | string | Billing phone |
| `billing_company` | string | Billing company |
| `billing_address_line1` | string | Billing street address |
| `billing_address_line2` | string | Billing apartment, suite, etc. |
| `billing_city` | string | Billing city |
| `billing_zip` | string | Billing postal code |
| `billing_country_id` | integer | Billing country ID |
| `billing_state_id` | integer | Billing state ID |

If billing details are not explicitly submitted, the billing address inherits from the contact details.

### Shipping Details

Triggered by `post_shipping_details = true`. Uses the same fields as contact details with a `shipping_` prefix.

| Parameter | Type | Description |
| --- | --- | --- |
| `shipping_first_name` | string | Shipping first name |
| `shipping_last_name` | string | Shipping last name |
| `shipping_company` | string | Shipping company |
| `shipping_phone` | string | Shipping phone |
| `shipping_address_line1` | string | Shipping street address |
| `shipping_address_line2` | string | Shipping apartment, suite, etc. |
| `shipping_city` | string | Shipping city |
| `shipping_zip` | string | Shipping postal code |
| `shipping_country_id` | integer | Shipping country ID |
| `shipping_state_id` | integer | Shipping state ID |
| `shipping_is_business` | boolean | Business address flag |

If shipping details are not explicitly submitted, the shipping address inherits from the contact details.

### Shipping Method

Triggered by `post_shipping_method = true`.

| Parameter | Type | Description |
| --- | --- | --- |
| `shipping_method` | integer | The shipping method ID. For methods with child options, this may include the child option identifier |

### Payment Method

Triggered by `post_payment_method = true`.

| Parameter | Type | Description |
| --- | --- | --- |
| `payment_method` | integer | The payment method ID |

### Additional Parameters

These parameters are processed on every request, without requiring a flag:

| Parameter | Type | Description |
| --- | --- | --- |
| `user_notes` | string | Order notes or special instructions |
| `coupon` | string | Coupon code to apply |
| `cart_name` | string | Cart name (default: `main`) |
| `skip_validation` | boolean | Disable validation for partial/eager updates |
| `checkout_step` | string | Used by templates to track which step is displayed |

### Guest Registration

These parameters are processed during order placement:

| Parameter | Type | Description |
| --- | --- | --- |
| `register_user` | boolean | Create a customer account for the guest |
| `user_password` | string | Password for the new account |
| `user_auto_login` | boolean | Auto-login after registration |
| `user_register_notification` | boolean | Send registration email |

## Checkout Flow

The Commerce Theme implements a three-step checkout flow. Each step submits its data to the `onAction` handler, which stores it in the session and returns updated page variables.

```
Step 1: Contact Details & Address
    ↓ post_contact_details = true
Step 2: Shipping Method
    ↓ post_shipping_method = true
Step 3: Payment Method
    ↓ post_payment_method = true
Place Order → onPlaceOrder
    ↓ Redirect to payment page
Payment Page → onPay
    ↓ Redirect to receipt
```

For carts that contain only digital products, `shippingRequired` is `false` and the shipping step is skipped automatically. A special "No Shipping Required" method is set behind the scenes.

### Step Navigation with skip_validation

When navigating backward between steps (e.g., "Return to Details"), pass `skip_validation: true` to prevent validation errors on the current step's incomplete data:

```html
<a href="javascript:;"
    data-request="onAction"
    data-request-data="{ checkout_step: 'details', skip_validation: true }"
    data-request-update="{ 'shop/checkout-view': '#shopCheckoutView' }">
    Return to Details
</a>
```

### Cart Integrity

The component detects when cart contents change during checkout (items added/removed in another tab). When this happens, the checkout state is reset and the page is refreshed to recalculate totals. This prevents the customer from placing an order with stale pricing.

Similarly, if the order has already been paid (e.g., the customer navigates back to the checkout page after paying), the component redirects to the receipt page.

## Complete Examples

### Checkout Page

```twig
{# pages/shop/checkout.htm #}
##
url = "/shop/checkout"
layout = "default"
title = "Checkout"

[checkout]
==
{% if not checkout.isCartEmpty %}
    {% put scripts %}
        {% for method in allPaymentMethods %}
            {{ method.renderPaymentScripts()|raw }}
        {% endfor %}
    {% endput %}
    <div id="shopCheckoutView">
        {% partial 'shop/checkout-view' %}
    </div>
{% else %}
    <div class="container">
        <h1>Checkout</h1>
        <p>Your shopping cart is empty.</p>
        <a href="{{ 'shop/index'|page }}" class="btn btn-primary">Continue Shopping</a>
    </div>
{% endif %}
```

::: warning
Payment method scripts must be loaded regardless of which step the customer is on. The `renderPaymentScripts()` call loads JavaScript required by payment gateways (e.g., Stripe.js) that may need to be initialized before the payment form is displayed.
:::

### Step Router

The checkout view partial acts as a step router, displaying different content based on the `checkout_step` POST value:

```twig
{# partials/shop/checkout-view.htm #}
{% set checkoutStep = post('checkout_step', 'details') %}

<div class="row">
    <div class="col-lg-7">
        <form id="checkoutForm" data-control="checkout-form" data-request-flash>
            {% if checkoutStep == 'details' %}
                {% partial 'shop/checkout-step-details' %}
                <input type="hidden" name="post_contact_details" value="true" />
                <button
                    data-request="onAction"
                    data-request-data="{ checkout_step: 'shipping' }"
                    data-request-update="{ 'shop/checkout-view': '#shopCheckoutView' }"
                    data-attach-loading
                    class="btn btn-primary btn-lg">
                    Continue to Shipping
                </button>

            {% elseif checkoutStep == 'shipping' %}
                {% partial 'shop/checkout-step-shipping' %}
                <input type="hidden" name="post_shipping_method" value="true" />
                <a href="javascript:;"
                    data-request="onAction"
                    data-request-data="{ checkout_step: 'details', skip_validation: true }"
                    data-request-update="{ 'shop/checkout-view': '#shopCheckoutView' }">
                    Return to Details
                </a>
                <a href="javascript:;"
                    data-request="onAction"
                    data-request-data="{ checkout_step: 'payment' }"
                    data-request-update="{ 'shop/checkout-view': '#shopCheckoutView' }"
                    data-attach-loading
                    class="btn btn-primary btn-lg">
                    Continue to Payment
                </a>

            {% elseif checkoutStep == 'payment' %}
                {% partial 'shop/checkout-step-payment' %}
                <input type="hidden" name="post_payment_method" value="true" />
                <a href="javascript:;"
                    data-request="onAction"
                    data-request-data="{ checkout_step: 'shipping', skip_validation: true }"
                    data-request-update="{ 'shop/checkout-view': '#shopCheckoutView' }">
                    Return to Shipping
                </a>
            {% endif %}
        </form>

        {% if checkoutStep == 'payment' %}
            <div id="shopPaymentForm">
                {% partial 'shop/payment-form' %}
            </div>
        {% endif %}
    </div>
    <div class="col-lg-5" id="shopCheckoutOrderSummary">
        {% partial 'shop/order-summary' %}
    </div>
</div>
```

### Contact Details Step

```twig
{# partials/shop/checkout-step-details.htm #}
<div class="d-flex align-items-center mb-2">
    <h4 class="m-0">Contact Details</h4>
    {% if not checkout.user %}
        <div class="ms-auto small">
            Already have an account?
            <a href="{{ 'account/login'|page }}">Sign in first</a>
        </div>
    {% endif %}
</div>

{% if checkout.user %}
    <div class="alert alert-light">
        Bill to <strong>{{ checkout.user.full_name }}, {{ checkout.user.email }}</strong>
        <a href="javascript:;" data-request="onLogout" class="ms-auto">Logout</a>
    </div>
{% else %}
    <div class="form-floating mb-2">
        <input name="email" type="text" class="form-control"
            value="{{ address.email }}" placeholder="Email Address" required />
        <label>Email Address</label>
    </div>
    <label>
        <input type="checkbox" name="register_customer" value="1" />
        Save my details for faster checkout
    </label>
{% endif %}

<h4>{{ shippingRequired ? 'Shipping Details' : 'Billing Details' }}</h4>

{% if checkout.user %}
    <div class="form-floating">
        {% partial 'account/select-address'
            user=checkout.user
            addressBookId=address.address_book_id %}
        <label>Address Book</label>
    </div>
{% endif %}

<div class="row g-3">
    <div class="col-6">
        <div class="form-floating">
            <input name="first_name" type="text" class="form-control"
                value="{{ address.first_name }}" placeholder="First Name" required />
            <label>First Name</label>
        </div>
    </div>
    <div class="col-6">
        <div class="form-floating">
            <input name="last_name" type="text" class="form-control"
                value="{{ address.last_name }}" placeholder="Last Name" required />
            <label>Last Name</label>
        </div>
    </div>
    <div class="col-12">
        <div class="form-floating">
            <input name="address_line1" type="text" class="form-control"
                value="{{ address.address_line1 }}" placeholder="Address" />
            <label>Address</label>
        </div>
    </div>
    <div class="col-md-6">
        <div class="form-floating">
            <input name="city" type="text" class="form-control"
                value="{{ address.city }}" placeholder="City" />
            <label>City</label>
        </div>
    </div>
    <div class="col-md-6">
        <div class="form-floating">
            <input name="zip" type="text" class="form-control"
                value="{{ address.zip }}" placeholder="Zip / Postal Code" />
            <label>Zip / Postal Code</label>
        </div>
    </div>
    <div class="col-12">
        <div class="form-floating">
            {% partial 'account/select-country' countryId=address.country_id %}
            <label>Country</label>
        </div>
    </div>
    <div class="col-12">
        <div class="form-floating">
            {% partial 'account/select-state'
                countryId=address.country_id
                stateId=address.state_id %}
            <label>State</label>
        </div>
    </div>
    <div class="col-12">
        <div class="form-floating">
            <input name="phone" type="text" class="form-control"
                value="{{ address.phone }}" placeholder="Phone" />
            <label>Phone</label>
        </div>
    </div>
</div>
```

### Shipping Method Step

```twig
{# partials/shop/checkout-step-shipping.htm #}
<h4>Shipping Method</h4>

{% if hasShippingAddress %}
    {% if shippingMethods is not empty %}
        <ul class="list-group mt-3">
            {% for method in shippingMethods %}
                {% if method.hasChildOptions %}
                    {% for childOption in method.childOptions %}
                        <li class="list-group-item">
                            <label class="d-flex w-100">
                                <input type="radio" name="shipping_method"
                                    value="{{ childOption.id }}"
                                    {{ shippingMethod.id == childOption.id ? 'checked' }} />
                                <div class="ps-2">
                                    <p class="mb-0">{{ method.name }} - {{ childOption.name }}</p>
                                    {% if method.description %}
                                        <small class="text-muted">{{ method.description }}</small>
                                    {% endif %}
                                </div>
                                <div class="ms-auto fw-bold">
                                    {{ childOption.quote|currency }}
                                </div>
                            </label>
                        </li>
                    {% endfor %}
                {% else %}
                    <li class="list-group-item">
                        <label class="d-flex w-100">
                            <input type="radio" name="shipping_method"
                                value="{{ method.id }}"
                                {{ shippingMethod.id == method.id ? 'checked' }} />
                            <div class="ps-2">
                                <p class="mb-0">{{ method.name }}</p>
                                {% if method.description %}
                                    <small class="text-muted">{{ method.description }}</small>
                                {% endif %}
                            </div>
                            <div class="ms-auto fw-bold">
                                {% if method.isFree %}
                                    Free
                                {% else %}
                                    {{ method.quote|currency }}
                                {% endif %}
                            </div>
                        </label>
                    </li>
                {% endif %}
            {% endfor %}
        </ul>
    {% else %}
        <p>No shipping methods available for your location.</p>
    {% endif %}
{% else %}
    <p>Enter your shipping address to view available shipping methods.</p>
{% endif %}
```

### Payment Method Step

```twig
{# partials/shop/checkout-step-payment.htm #}
<h4>Payment Method</h4>

{% if paymentMethods is not empty %}
    <ul class="list-group mt-3">
        {% for method in paymentMethods %}
            <li class="list-group-item">
                <label class="d-flex w-100">
                    <input type="radio" name="payment_method"
                        value="{{ method.id }}"
                        {{ paymentMethod.id == method.id ? 'checked' }} />
                    <div class="ps-2">
                        <p class="mb-0">{{ method.name }}</p>
                        {% if method.description %}
                            <small class="text-muted">{{ method.description }}</small>
                        {% endif %}
                    </div>
                </label>
            </li>
        {% endfor %}
    </ul>
{% else %}
    <p>No payment methods available.</p>
{% endif %}
```

### Order Summary

```twig
{# partials/shop/order-summary.htm #}
<ul class="list-group list-group-flush">
    {% for item in items %}
        {% set product = item.product %}
        <li class="list-group-item py-3">
            <div class="row align-items-center">
                <div class="col-3">
                    <div class="position-relative">
                        {% if product.images is not empty %}
                            <img class="img-fluid"
                                src="{{ product.images.first|resize(0, 100, { mode: 'auto' }) }}"
                                alt="{{ product.name }}" />
                        {% endif %}
                        <span class="badge rounded-pill bg-secondary position-absolute top-0 start-100 translate-middle">
                            {{ item.quantity }}
                        </span>
                    </div>
                </div>
                <div class="col-6">
                    <h5 class="mb-1">{{ product.name }}</h5>
                    <div class="small">
                        {% for option in item.options %}
                            {{ option.name }}: {{ option.value }}{{ not loop.last ? ', ' }}
                        {% endfor %}
                        {% for extra in item.extras %}
                            <br />+ {{ extra.description }}
                        {% endfor %}
                    </div>
                </div>
                <div class="col-3 text-end small">
                    {{ item.final_line_price|currency }}
                </div>
            </div>
        </li>
    {% endfor %}
</ul>

<div class="card">
    <ul class="list-group list-group-flush">
        <li class="list-group-item d-flex justify-content-between small">
            <span>Subtotal</span>
            <span>{{ order.final_subtotal|currency }}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between small">
            <span>Shipping</span>
            {% if not hasShippingAddress %}
                <small class="text-muted">Enter address</small>
            {% elseif not hasShippingQuote %}
                <small class="text-muted">Select shipping</small>
            {% else %}
                <span>{{ order.final_shipping_quote|currency }}</span>
            {% endif %}
        </li>
        <li class="list-group-item d-flex justify-content-between">
            <span class="fw-bold">Total</span>
            <span class="fw-bold fs-5">{{ order.total|currency }}</span>
        </li>
        <li class="list-group-item small">
            Includes {{ order.total_tax|currency }} in taxes
        </li>
    </ul>
</div>
```

### Payment Page

After the order is placed, the customer is redirected to the payment page. This page uses the `[payment]` component from Responsiv.Pay:

```twig
{# pages/shop/payment.htm #}
##
url = "/shop/payment/:hash"
layout = "default"
title = "Order"

[payment]
isDefault = 1
==
{% set order = invoice.related %}
{% if not order or not order.order_number %}
    {% do abort(404) %}
{% endif %}

{% put scripts %}
    {% for method in paymentMethods %}
        {{ method.renderPaymentScripts()|raw }}
    {% endfor %}
{% endput %}

<div class="container">
    <div class="row">
        <div class="col-lg-7">
            <p>Order #{{ order.order_number }}</p>
            <h2>Thank you, {{ order.billing_first_name }}!</h2>

            {% if order.is_payment_processed %}
                <div class="card mb-3">
                    <div class="card-body">
                        <h5>Your Order is Confirmed</h5>
                        <p>We have processed your payment and accepted your order.</p>
                    </div>
                </div>
            {% else %}
                <div class="card mb-3">
                    <div class="card-body">
                        <h5>Your Order is Pending</h5>
                        <p>Please use a payment method below to complete this order.</p>
                    </div>
                </div>

                {% if paymentMethods is not empty %}
                    <ul class="list-group mb-3">
                        {% for method in paymentMethods %}
                            <li class="list-group-item">
                                <label class="d-flex w-100">
                                    <input type="radio" name="payment_method"
                                        value="{{ method.id }}"
                                        data-request="onUpdatePaymentMethod"
                                        data-request-update="{
                                            'shop/payment-form': '#shopPaymentForm',
                                            'shop/order-details': '#shopOrderDetails'
                                        }"
                                        {{ order.payment_method_id == method.id ? 'checked' }} />
                                    <div class="ps-2">{{ method.name }}</div>
                                </label>
                            </li>
                        {% endfor %}
                    </ul>
                {% endif %}

                <div id="shopPaymentForm">
                    {% partial 'shop/payment-form' %}
                </div>
            {% endif %}
        </div>
        <div class="col-lg-5" id="shopCheckoutOrderSummary">
            {% partial 'shop/order-summary' items=order.items %}
        </div>
    </div>
</div>
```

## The checkout-form.js Control

The Commerce Theme includes a `checkout-form.js` JavaScript control that enhances the checkout experience. When applied to a form via `data-control="checkout-form"`, it:

- Listens for changes to country, state, and address book selectors.
- Automatically submits updated address data when the customer changes their country or selects an address book entry.
- Updates the order summary and available shipping/payment methods without the customer clicking a button.

```html
<form id="checkoutForm" data-control="checkout-form" data-request-flash>
    <!-- Checkout steps -->
</form>
```

This control is optional — the checkout works without it, but the customer would need to click "Continue" to see updated shipping rates after changing their address.

## Events

The checkout process fires several events. See the [Events](../hooks/events) documentation for details:

- `shop.beforePlaceOrder` — Before the order is created.
- `shop.beforeCreateOrderRecord` — Before a new order is saved to the database.
- `shop.beforeUpdateOrderRecord` — Before an existing order is updated (amendment).
- `shop.newOrder` — After a new order is created.
- `shop.checkout.beforeSetCouponCode` — Before a coupon code is validated (allows modification).

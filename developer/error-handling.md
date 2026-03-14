---
subtitle: Handle errors gracefully in your storefront.
---
# Error Handling

This guide covers how Meloncart handles errors and how to display them in your storefront theme.

## How Errors Work

Meloncart uses October CMS's [AJAX framework](https://docs.octobercms.com/4.x/cms/ajax/introduction.html) for all interactive operations. When something goes wrong, the component handler throws an `ApplicationException` with a user-facing message. The AJAX framework automatically converts these into error responses.

To display errors, add `data-request-flash` to your form or button:

```html
<button
    data-request="onAddToCart"
    data-request-data="{ product_baseid: '{{ product.baseid }}' }"
    data-request-flash>
    Add to Cart
</button>
```

The AJAX framework renders flash messages using the [flash message partial](https://docs.octobercms.com/4.x/cms/ajax/flash-messages.html). If you need custom error handling, use `data-request-error` instead:

```html
<button
    data-request="onAddToCart"
    data-request-data="{ product_baseid: '{{ product.baseid }}' }"
    data-request-error="handleCartError(data)">
    Add to Cart
</button>

<script>
function handleCartError(data) {
    alert(data.X_OCTOBER_ERROR_MESSAGE);
    return false; // Prevent default flash message
}
</script>
```

## Cart Errors

These errors are thrown by the `Cart` component's `onAddToCart` handler and the internal `CartManager`.

| Error | When |
|-------|------|
| Product not found | The `product_baseid` is missing or doesn't match any product |
| Invalid quantity provided | The quantity is zero or negative |
| Only X unit(s) of the Y product are available in stock | Requested quantity exceeds available stock |

### Out of Stock

The out-of-stock error is a special `OutOfStockException` that carries the product and available quantity. It fires when a customer tries to add more items than are in stock (and `allow_negative_stock` is false on the product).

```twig
{# Prevent the error by checking stock before showing the add-to-cart button #}
{% if product.track_inventory and product.isOutOfStock() %}
    {% if product.allow_pre_order %}
        <button data-request="onAddToCart" data-request-flash>
            Pre-Order
        </button>
    {% else %}
        <span class="text-danger">
            Out of Stock
        </span>
    {% endif %}
{% else %}
    <button data-request="onAddToCart" data-request-flash>
        Add to Cart
    </button>
{% endif %}
```

## Coupon Errors

These errors are thrown when applying a coupon code via `onApplyCoupon`.

| Error | When |
|-------|------|
| Please enter a coupon code. | The coupon field is empty |
| The specified coupon could not be found. | No coupon with that code exists |
| The specified coupon is not valid or has expired. | The coupon has expired or failed validation |
| This coupon is not currently active. | The coupon exists but has no active price rule |
| This coupon has reached its usage limit. | Global `max_coupon_uses` limit exceeded |
| You have already used this coupon the maximum number of times. | Per-customer `max_customer_uses` limit exceeded |

```html
<form data-request="onApplyCoupon" data-request-flash>
    <input type="text" name="coupon" placeholder="Coupon code" />
    <button type="submit">
        Apply
    </button>
</form>
```

## Checkout Errors

### Shipping

| Error | When |
|-------|------|
| Please select a shipping method. | Validation enabled and no method selected |
| Shipping method not found. | The selected method ID doesn't exist |
| Shipping method is not available. | The shipping driver returned no quote for this address |

### Payment

| Error | When |
|-------|------|
| Please select a payment method. | Validation enabled and no method selected |
| Payment method not found. | The selected method ID doesn't exist |
| Please log in to pay using the stored details | Attempting `pay_from_profile` without being logged in |
| The invoice does not belong to your account | Invoice user doesn't match logged-in user |

### Order Placement

| Error | When |
|-------|------|
| Cart is empty | No items in cart when calling `onPlaceOrder`, `onPrepareOrder`, or `onPay` |

## Validation Errors

Some checkout operations use `ValidationException` for field-level errors. These return per-field error messages that the AJAX framework can display inline.

For field-level error display, use `data-validate-for`:

```html
<div class="form-group">
    <input name="email" type="text" class="form-control" />
    <span data-validate-for="email" class="text-danger"></span>
</div>
```

## Troubleshooting

### Flash messages not appearing

Ensure your layout includes the AJAX framework and flash message partial:

```twig
{% framework extras %}
{% flash %}
    <div class="alert alert-{{ type }}">
        {{ message }}
    </div>
{% endflash %}
```

And that your buttons/forms include `data-request-flash`:

```html
<button data-request="onAddToCart" data-request-flash>
```

### Shipping methods not loading

Shipping methods require a valid address (country, state, zip). The `checkout-form` JavaScript control automatically refreshes shipping options when address fields change. If methods don't appear:

- Verify the customer has entered a country and postal code
- Check that your shipping methods are enabled and configured for the destination country
- Ensure your form uses `data-control="checkout-form"` for automatic address change detection

### Payment page shows 404

The checkout component needs a payment page configured in your theme. Create a page with the URL pattern `/shop/payment/:hash` and the `[payment]` component from Responsiv.Pay.

### Coupon says "not currently active"

A coupon code must be linked to an active Cart Price Rule. Check in the backend under **Shop > Price Rules** that:

- The price rule exists and is enabled
- The coupon is assigned to the rule under the Conditions tab
- The rule's date range (if set) includes today

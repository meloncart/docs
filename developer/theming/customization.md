---
subtitle: Customize the look and feel.
---
# Customization

Meloncart is designed to be fully customizable through [October CMS's theming system](https://docs.octobercms.com/4.x/cms/themes/themes.html). The commerce theme serves as a complete reference implementation that you can copy, modify, or use as inspiration for building your own storefront.

## Theme Structure

A Meloncart-powered theme follows the standard October CMS theme structure with shop-specific pages and partials:

```
themes/your-theme/
├── assets/
│   ├── css/
│   ├── js/
│   │   └── controls/          ← Frontend JavaScript controls
│   └── images/
├── layouts/
│   ├── default.htm            ← Main site layout
│   └── account.htm            ← Account pages layout
├── pages/
│   ├── shop/
│   │   ├── index.htm          ← Shop homepage / catalog
│   │   ├── category.htm       ← Category listing
│   │   ├── product.htm        ← Product detail
│   │   ├── cart.htm            ← Shopping cart
│   │   ├── checkout.htm       ← Checkout flow
│   │   └── payment.htm        ← Payment processing
│   └── account/
│       ├── login.htm           ← Login page
│       ├── register.htm        ← Registration
│       ├── index.htm           ← Profile
│       ├── orders.htm          ← Order history
│       ├── order.htm           ← Order detail
│       ├── addresses.htm       ← Address book
│       ├── password.htm        ← Password reset
│       └── security.htm        ← Security settings
├── partials/
│   ├── shop/                   ← Shop UI partials
│   └── account/                ← Account UI partials
├── content/
└── theme.yaml
```

### Theme Dependencies

Your `theme.yaml` should declare the required plugins:

```yaml
name: My Store
description: 'Custom eCommerce theme.'
author: Your Name
require:
    - Meloncart.Shop
    - RainLab.User
    - RainLab.UserPlus
    - RainLab.Location
    - Responsiv.Pay
    - Responsiv.Currency
```

## Using the Commerce Theme

The commerce theme is the recommended starting point for building a Meloncart storefront. You can use it in two ways:

**Copy and modify** — Duplicate the entire `themes/commerce-theme/` directory as your own theme, then modify pages and partials to match your design.

**Reference implementation** — Build your theme from scratch, referencing the commerce theme's pages and partials to understand how components and AJAX handlers are used.

The commerce theme includes complete implementations of every Meloncart feature, including multi-step checkout, product galleries, cart management, account pages, and order history.

## Overriding Partials

The commerce theme separates its UI into small, focused partials. This makes it easy to customize individual pieces without affecting the rest of the storefront.

### Shop Partials

| Partial | Purpose |
| --- | --- |
| `shop/product-view` | Full product detail layout |
| `shop/product-images` | Product image gallery |
| `shop/product-options` | Product option selectors (size, color) |
| `shop/product-extras` | Product extras with pricing |
| `shop/product-attributes` | Product specifications table |
| `shop/product-card` | Product card for grid/list views |
| `shop/add-to-cart-control` | Add-to-cart form with quantity selector |
| `shop/cart-view` | Full cart page layout |
| `shop/cart-list` | Cart item listing |
| `shop/cart-summary` | Cart totals and checkout button |
| `shop/mini-cart` | Mini cart badge in navigation |
| `shop/checkout-step-details` | Checkout contact/address step |
| `shop/checkout-step-shipping` | Shipping method selection |
| `shop/checkout-step-payment` | Payment method selection |
| `shop/order-summary` | Order total breakdown |
| `shop/payment-form` | Payment gateway form |
| `shop/shipping-estimator` | Cart shipping cost estimator |
| `shop/breadcrumb` | Category/product breadcrumbs |
| `shop/category-products` | Category page product listing |

### Account Partials

| Partial | Purpose |
| --- | --- |
| `account/login-form` | Login form |
| `account/login-recovery-form` | Password recovery form |
| `account/login-two-factor-form` | 2FA challenge form |
| `account/field-name` | Editable name field |
| `account/field-email` | Editable email with verification |
| `account/field-password` | Editable password field |
| `account/field-profile` | Company/phone profile fields |
| `account/field-two-factor-auth` | 2FA management |
| `account/field-account-sessions` | Browser session management |
| `account/field-account-delete` | Account deletion |
| `account/address-list` | Address book listing |
| `account/sidebar` | Account navigation sidebar |

## Extending Meloncart

Beyond theming, you can extend Meloncart's core functionality by building custom payment gateways, shipping providers, and discount rules. Each has a dedicated guide:

- [Payment Gateways](../extending/payment-gateways) — Build custom payment integrations by extending `GatewayBase`
- [Shipping Types](../extending/shipping-types) — Build custom shipping rate providers by extending `ShippingTypeBase`
- [Price Rules](../extending/price-rules) — Build custom discount actions and conditions for the price rule engine

## Mail Templates

Meloncart registers four mail templates and one shared partial. You can customize these in the backend under **Settings > Mail Templates** or by overriding them in your plugin.

### Templates

| Code | Subject | Recipients | Description |
| --- | --- | --- | --- |
| `shop:order_thankyou` | Thank you for your order! | Customer | Sent when a new order is placed |
| `shop:new_order_internal` | New Order - #{order_id} | Admins | Sent to store managers on new orders |
| `shop:order_status_update_internal` | Order Status Changed - #{order_id} | Admins | Sent when an order changes status |
| `shop:low_stock_internal` | Product Stock Low - {product.name} | Admins | Sent when a product reaches its low stock threshold |

### Shared Partial

The `shop_order_content` partial is used by order-related templates to render the order items table. It provides both a plain-text and HTML version of the order line items.

### Template Variables

All order templates have access to these variables:

| Variable | Type | Description |
| --- | --- | --- |
| `order` | Order | The order model with all relationships |
| `order.id` | integer | Order ID |
| `order.ordered_at` | Carbon | Order date |
| `order.total` | integer | Grand total (use `\|currency` filter) |
| `order.items` | Collection | Order line items |
| `user` | User | The customer (available in `order_thankyou`) |
| `status` | OrderStatus | New status (available in status update template) |
| `previous_status` | OrderStatus | Previous status |
| `comment` | string | Status transition comment |
| `product` | Product | The product (available in `low_stock_internal`) |

::: tip
You can add custom variables to order and product notification templates using the `shop.order.getNotificationVars` and `shop.product.getNotificationVars` [events](../hooks/events).
:::

### Customizing Templates

Edit templates in the backend UI at **Settings > Mail Templates**, or override them programmatically:

```php
public function boot()
{
    // Override the order confirmation template
    Event::listen('mailer.beforeSend', function($mailer) {
        // Custom pre-send logic
    });
}
```

## JavaScript Controls

The commerce theme includes reusable JavaScript controls built on the [`oc.ControlBase`](https://docs.octobercms.com/4.x/cms/ajax/hot-controls.html) framework. These controls handle interactive UI behavior on the frontend.

### checkout-form

Manages the multi-step checkout form interactions. Automatically updates shipping options, payment methods, and order totals when the customer changes their address or selections.

```twig
<form data-control="checkout-form" data-request="onAction">
    <!-- Checkout form fields -->
</form>
```

**Behavior:**
- Detects changes to address fields (`city`, `zip`, `state_id`, `country_id`) and refreshes shipping options
- Detects changes to `shipping_method` and refreshes payment options and order summary
- Detects changes to `payment_method` and refreshes the payment form
- Detects changes to `address_book_id` and loads the selected address
- Listens for `pay:fetch-invoice` events from payment gateways to prepare the order

### quantity-input

Provides increment/decrement buttons for quantity fields.

```twig
<div data-control="quantity-input">
    <button type="button" class="button-minus">-</button>
    <input type="text" name="quantity" value="1" class="quantity-field" />
    <button type="button" class="button-plus">+</button>
</div>
```

### gallery-slider

Product image gallery with thumbnail navigation and lightbox support. Uses Slick carousel for the slider and PhotoSwipe for the lightbox.

```twig
<div data-control="gallery-slider">
    <div class="gallery-previews">
        <!-- Full-size images -->
    </div>
    <div class="gallery-thumbs">
        <!-- Thumbnail images -->
    </div>
</div>
```

### card-slider

Horizontal card carousel for product cards, featured items, or any card-based content. Uses Slick carousel.

### Creating Custom Controls

You can create your own controls following the same pattern:

```js
oc.registerControl('my-control', class extends oc.ControlBase {
    connect() {
        // Called when the control is mounted to the DOM
        this.listen('click', '.my-button', this.onButtonClick);
    }

    disconnect() {
        // Called when the control is removed from the DOM
        // Clean up event listeners and references
    }

    onButtonClick(event) {
        event.preventDefault();

        // Make an AJAX request
        oc.request(this.element, 'onMyHandler', {
            update: {
                'shop/my-partial': '#myTarget'
            }
        });
    }
});
```

Include custom controls on your page using the [`[resources]`](https://docs.octobercms.com/4.x/cms/themes/components.html) component:

```ini
[resources]
js[] = "controls/my-control.js"
```

## Checkout Customization

### Multi-Step vs Single-Page

The commerce theme includes two checkout page implementations:

- `checkout.htm` — Multi-step checkout with separate sections for contact details, shipping, and payment
- `checkout-single.htm` — Single-page checkout with all steps visible at once

Both use the same `[checkout]` component and AJAX handlers. The difference is in how the page partials are arranged. You can choose either approach or design your own layout.

### Custom Checkout Flow

The `checkout-form` JavaScript control coordinates updates between checkout steps. When a customer changes their address, the control automatically calls `onAction` to refresh the shipping and payment sections.

To customize the checkout flow, you can:

1. **Rearrange partials** — Move sections around, combine steps, or split them differently
2. **Add custom fields** — Include extra fields in the checkout form (they will be submitted with `onAction`)
3. **Override partial content** — Replace individual step partials with your own designs
4. **Skip the control** — Build your own JavaScript to manage step interactions

### Payment Page

The payment page (`shop/payment.htm`) handles payment processing after order placement. It receives an `invoice_hash` parameter from the checkout and renders the payment gateway's form.

```twig
url = "/shop/payment/:hash?"
==
{% set invoice = checkout.getInvoice %}
{% if invoice %}
    {{ invoice.getPaymentFormHtml|raw }}
{% endif %}
```

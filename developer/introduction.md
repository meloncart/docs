---
subtitle: Learn how to build your commerce website and use advanced features.
---
# Developer Guide

This guide covers everything you need to build a storefront with Meloncart. It explains the available CMS components, their Twig APIs, AJAX handlers, and the events you can hook into for customization.

::: info Foundation Topics
Meloncart is built on October CMS. This guide assumes familiarity with these October CMS concepts:

- [Themes](https://docs.octobercms.com/4.x/cms/themes/themes.html) — Pages, partials, layouts, and content blocks
- [Components](https://docs.octobercms.com/4.x/cms/themes/components.html) — Dropping functionality into theme pages
- [AJAX Framework](https://docs.octobercms.com/4.x/cms/ajax/introduction.html) — Data attributes, handlers, and partial updates
- [Twig Markup](https://docs.octobercms.com/4.x/markup/templating.html) — Template syntax, filters, and functions
:::

## Theme Architecture

A Meloncart storefront is built using [October CMS themes](https://docs.octobercms.com/4.x/cms/themes/themes.html). A theme contains pages, partials, layouts, and assets that together form your store's frontend. Meloncart provides CMS components that you drop into your theme pages to add commerce functionality — browsing products, managing a cart, and checking out.

The recommended starting point is the **Commerce Theme**, a fully working reference implementation included with Meloncart. It demonstrates every component and pattern described in this guide. You can use it as-is, customize it, or study it while building your own theme from scratch.

### Pages and Components

Each storefront page declares one or more components in its configuration section. For example, a product detail page uses the `catalog` component to load a product, and the `cart` component to handle add-to-cart actions:

```ini
url = "/shop/product/:slug*/:baseid"

[cart]
[catalog]
lookup = "product"
identifier = "baseid"
```

Components provide:

- **Page variables** — Data set during `onRun()` that your Twig templates can access (e.g., `product`, `category`).
- **Twig methods** — Methods callable from templates (e.g., `cart.totalItems()`, `catalog.allCategories()`).
- **AJAX handlers** — Server-side handlers triggered by `data-request` attributes (e.g., `onAddToCart`, `onPlaceOrder`).

### Partials and AJAX Updates

Meloncart makes heavy use of [AJAX partial updates](https://docs.octobercms.com/4.x/cms/ajax/update-partials.html). When a user adds an item to the cart, the handler can update specific page regions without a full reload:

```html
<button
    data-request="onAddToCart"
    data-request-update="{ 'shop/mini-cart': '#miniCart' }"
    data-request-data="{ product_baseid: '{{ product.baseid }}' }"
    data-request-flash>
    Add to Cart
</button>
```

The [`data-request-update`](https://docs.octobercms.com/4.x/cms/ajax/attributes-api.html) attribute tells the AJAX framework which partials to re-render and where to inject them in the DOM. This pattern is used throughout the cart, checkout, and shipping estimator.

## Available Components

Meloncart registers four CMS components:

| Component | Alias | Description |
| --- | --- | --- |
| [Cart](./components/cart) | `cart` | Shopping cart management — add, remove, update items, estimate shipping |
| [Catalog](./components/catalog) | `catalog` | Product and category lookups, queries, and navigation |
| [Checkout](./components/checkout) | `checkout` | Multi-step checkout flow, order placement, and payment processing |
| Reviews | `reviews` | Product review submission and display |

In addition to these commerce components, your storefront will typically use components from the **RainLab.User** plugin for customer authentication and account management:

| Component | Description |
| --- | --- |
| [Session](./components/session) | User session management and page access control |
| [Registration](./components/registration) | Customer registration form |
| [Authentication](./components/authentication) | Login, password recovery, and two-factor authentication |
| [New Password](./components/new-password) | Password reset confirmation page |
| [Profile Details](./components/profile-details) | Customer profile and address management |
| [Security Details](./components/security-details) | Two-factor setup, active sessions, and account deletion |

And for order-related pages:

| Component | Description |
| --- | --- |
| [Order History](./components/order-history) | Customer order list and order detail display |
| [Wishlist](./components/wishlist) | Saved-for-later items using named carts |

## Key Concepts

### Base Identifiers

Many Meloncart models (products, categories, manufacturers, orders) use a **base identifier** (`baseid`) — a short, unique, URL-safe string generated automatically when the record is created. Base IDs are used in URL routing to identify records without exposing sequential database IDs:

```
/shop/product/blue-widget/a1b2c3d4
                          ^^^^^^^^ baseid
```

The `baseid` is stable and does not change if the product's slug is updated, making it the preferred identifier for URL routing.

### Currency and Prices

All prices in Meloncart are stored and calculated as **integers in cents** (e.g., `1999` = $19.99). This avoids floating-point rounding issues. When displaying prices in templates, use the [`|currency`](https://docs.octobercms.com/4.x/markup/filter/currency.html) Twig filter, which formats the value according to the store's currency settings:

```twig
{{ product.final_sale_price|currency }}
{# Output: $19.99 #}

{{ cart.totalPrice|currency({ format: 'long' }) }}
{# Output: $149.97 USD #}
```

### Product Price Properties

Products expose several price-related properties in Twig, each representing a different stage of price calculation:

| Property | Description |
| --- | --- |
| `price` | The base price as entered in the backend (in cents) |
| `final_price` | Base price with tax applied (no sale discount) |
| `final_sale_price` | Final customer-facing price — includes sale discounts, catalog price rules, tier pricing, and tax |
| `original_price` | Base price without tax |
| `original_sale_price` | Sale price without tax |
| `on_sale` | Boolean — true if the product has an active sale price or catalog price rule |
| `sale_price_reduction` | The amount saved (difference between `final_price` and `final_sale_price`) |

### Image Handling

Product and category images use October CMS [file attachments](https://docs.octobercms.com/4.x/extend/database/attachments.html). Access the first image and resize it using the [`|resize`](https://docs.octobercms.com/4.x/markup/filter/resize.html) filter:

```twig
{% set images = product.images %}
{% if images is not empty %}
    <img src="{{ images.first|resize(300, 200, { mode: 'auto' }) }}" alt="{{ product.name }}" />
{% endif %}
```

### Page URLs

Products, categories, and manufacturers can generate their own CMS page URLs using the `pageUrl()` method. Pass the page file name (without extension) as the argument:

```twig
<a href="{{ product.pageUrl('shop/product') }}">{{ product.name }}</a>
<a href="{{ category.pageUrl('shop/category') }}">{{ category.name }}</a>
```

This method resolves the URL using the component's routing parameters (`baseid`, `slug`, `fullslug`) and the target page's URL pattern.

### Breadcrumbs

Products and categories provide a `breadcrumbPath` property that returns the chain of parent categories, useful for building breadcrumb navigation:

```twig
<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="{{ 'shop/index'|page }}">Home</a></li>
        {% for category in product.breadcrumbPath %}
            <li class="breadcrumb-item">
                <a href="{{ category.pageUrl('shop/category') }}">{{ category.name }}</a>
            </li>
        {% endfor %}
        <li class="breadcrumb-item active">{{ product.name }}</li>
    </ol>
</nav>
```

## JavaScript Controls

The Commerce Theme includes several JavaScript controls that enhance the shopping experience. These are optional — you can use them in your own theme or replace them with your own implementations.

### checkout-form.js

The checkout form control (`data-control="checkout-form"`) manages the multi-step checkout experience. It listens for changes to address fields, shipping method, and payment method selections, automatically triggering AJAX requests to update the order summary and available options.

```html
<form id="checkoutForm" data-control="checkout-form" data-request-flash>
    <!-- Checkout steps rendered here -->
</form>
```

### quantity-input.js

The quantity input control (`data-control="quantity-input"`) adds increment and decrement buttons to a numeric input field:

```html
<div data-control="quantity-input" class="input-group control-quantity-input">
    <input type="button" value="-" class="btn btn-sm button-minus" />
    <input class="quantity-field form-control-sm" type="number" min="1" max="10"
        name="product_cart_quantity" value="1" />
    <input type="button" value="+" class="btn btn-sm button-plus" />
</div>
```

### gallery-slider.js

The gallery slider control provides a product image gallery with thumbnail navigation and lightbox support using Slick carousel and PhotoSwipe.

## Service Singletons

Meloncart registers three service singletons that manage core commerce operations behind the scenes:

| Service | Container Key | Description |
| --- | --- | --- |
| CartManager | `shop.cart` | Manages cart operations across session (guest) and database (logged-in) storage |
| CheckoutData | `shop.checkout` | Stores checkout session data (addresses, methods, coupon) and handles order creation |
| ShippingManager | `shop.shipping` | Manages shipping type registration and rate calculation |

These singletons are used internally by the CMS components. You generally interact with them through the component APIs rather than directly, but they are available via `App::make()` for advanced use cases in plugins and event handlers.

## Next Steps

- [Cart Component](./components/cart) — Learn how to add products to the cart, display cart contents, and estimate shipping.
- [Catalog Component](./components/catalog) — Learn how to display products, categories, and build navigation.
- [Checkout Component](./components/checkout) — Learn how to implement the full checkout flow from address entry through payment.
- [Events](./hooks/events) — Hook into order, cart, and product events for custom behavior.
- [Customization](./theming/customization) — Extend Meloncart with custom shipping types, price rules, and mail templates.

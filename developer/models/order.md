---
subtitle: Order, OrderItem, OrderStatus, OrderNote, and OrderTrackingCode model reference.
---
# Order Models

This reference documents all Twig-accessible properties and methods for order-related models. All prices are stored as integers in **base currency units (cents)** — use the `|currency` filter for display.

Orders are **computed records** — their totals are calculated from cart items, price rules, tax classes, and shipping methods. Prices are stored per-unit with separate tax-inclusive and tax-exclusive variants to support both pricing modes. Discounts are tracked per-unit (from price rules) with an additional `line_discount` field for rounding-safe line totals.

Orders are typically accessed through the user relationship (`user.orders`) or the [Checkout component](../components/checkout) during order placement. For the simpler accounting-oriented model, see [Invoice Models](./invoice).

## Order

The `Order` model represents a completed or in-progress customer order.

### Core Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Primary key |
| `baseid` | `string` | Base identifier (used as `order_hash`) |
| `order_number` | `int` | Same as `id` |
| `order_hash` | `string` | Same as `baseid` |
| `user_ip` | `string` | Customer IP address |
| `user_notes` | `string` | Customer-provided notes |
| `ordered_at` | `Carbon` | When the order was placed |
| `created_at` | `Carbon` | Creation date |
| `updated_at` | `Carbon` | Last update date |

### Financial Properties

All prices are stored as integers in **base currency units (cents)**.

| Property | Type | Description |
|----------|------|-------------|
| `subtotal` | `int` | Items subtotal after discounts, before tax and shipping. Formula: `sum(qty × original_price - line_discount)` |
| `original_subtotal` | `int` | Pre-discount subtotal: `subtotal + discount` |
| `final_subtotal` | `int` | Display subtotal. Tax-inclusive: `subtotal`. Tax-exclusive: `subtotal + sales_tax` |
| `discount` | `int` | Total discount amount across all items (excluding tax) |
| `discount_tax` | `int` | Tax portion of the total discount |
| `final_discount` | `int` | Total discount with tax: `discount + discount_tax` |
| `shipping_quote` | `int` | Shipping cost (excluding tax) |
| `shipping_tax` | `int` | Tax on shipping |
| `final_shipping_quote` | `int` | Display shipping. Tax-inclusive: `shipping_quote`. Tax-exclusive: `shipping_quote + shipping_tax`. Free: `0` |
| `shipping_is_free` | `bool` | Whether shipping is free (from price rules) |
| `sales_tax` | `int` | Tax on product items (excludes shipping tax) |
| `total_tax` | `int` | Total tax: `sales_tax + shipping_tax - discount_tax` |
| `total` | `int` | Final order total: `final_subtotal + final_shipping_quote` |
| `total_cost` | `int` | Total cost of goods: `sum(qty × cost)` |

### Tax Properties

| Property | Type | Description |
|----------|------|-------------|
| `is_tax_exempt` | `bool` | Whether the order is tax exempt |
| `prices_include_tax` | `bool` | Whether prices were stored with tax included |
| `sales_taxes` | `array` | Breakdown of sales tax rates |
| `shipping_taxes` | `array` | Breakdown of shipping tax rates |
| `all_taxes` | `array` | Combined sales and shipping tax breakdown |

The tax breakdown arrays contain objects with `name` (tax class name) and `amount` (tax in cents):

```twig
{% for tax in order.all_taxes %}
    <tr>
        <td>{{ tax.name }}</td>
        <td>{{ tax.amount|currency }}</td>
    </tr>
{% endfor %}
```

### Status Properties

| Property | Type | Description |
|----------|------|-------------|
| `status` | `OrderStatus` | Current status model |
| `status_updated_at` | `Carbon` | When status last changed |

The `status` object has these properties:

| Property | Type | Description |
|----------|------|-------------|
| `status.name` | `string` | Status display name (e.g., "New", "Paid") |
| `status.code` | `string` | Status code (e.g., `new`, `paid`) |
| `status.color_background` | `string` | Badge background color |
| `status.color_foreground` | `string` | Badge text color |

```twig
<span style="background: {{ order.status.color_background }};
             color: {{ order.status.color_foreground }}">
    {{ order.status.name }}
</span>
```

### Payment Properties

| Property | Type | Description |
|----------|------|-------------|
| `is_payment_processed` | `bool` | Whether payment has been received |
| `payment_processed_at` | `Carbon\|null` | When payment was processed |
| `payment_method` | `PaymentMethod` | Payment method used |
| `is_final` | `bool` | Whether the order is finalized |

### Shipping Properties

| Property | Type | Description |
|----------|------|-------------|
| `shipping_method` | `ShippingMethod` | Shipping method used |
| `shipping_child_option` | `string` | Selected sub-option (e.g., "Express") |
| `is_shipped` | `bool` | Whether any tracking codes exist |

### Billing Address

| Property | Type | Description |
|----------|------|-------------|
| `billing_first_name` | `string` | First name |
| `billing_last_name` | `string` | Last name |
| `billing_company` | `string` | Company name |
| `billing_email` | `string` | Email address |
| `billing_phone` | `string` | Phone number |
| `billing_address_line1` | `string` | Street address |
| `billing_address_line2` | `string` | Address line 2 |
| `billing_street_address` | `string` | Combined line 1 + line 2 |
| `billing_city` | `string` | City |
| `billing_zip` | `string` | Postal/ZIP code |
| `billing_state` | `State` | State/province model |
| `billing_country` | `Country` | Country model |

### Shipping Address

| Property | Type | Description |
|----------|------|-------------|
| `shipping_first_name` | `string` | First name |
| `shipping_last_name` | `string` | Last name |
| `shipping_company` | `string` | Company name |
| `shipping_phone` | `string` | Phone number |
| `shipping_address_line1` | `string` | Street address |
| `shipping_address_line2` | `string` | Address line 2 |
| `shipping_street_address` | `string` | Combined line 1 + line 2 |
| `shipping_city` | `string` | City |
| `shipping_zip` | `string` | Postal/ZIP code |
| `shipping_state` | `State` | State/province model |
| `shipping_country` | `Country` | Country model |
| `shipping_is_business` | `bool` | Business address flag |

### Relationships

| Property | Type | Description |
|----------|------|-------------|
| `user` | `User` | Customer account |
| `items` | `Collection<OrderItem>` | Order line items |
| `status_log` | `Collection<OrderStatusLog>` | Status change history |
| `notes` | `Collection<OrderNote>` | Admin and customer notes |
| `tracking_codes` | `Collection<OrderTrackingCode>` | Shipment tracking codes |
| `invoice` | `Invoice` | Primary invoice (via Responsiv.Pay) |
| `invoices` | `Collection<Invoice>` | All invoices |
| `coupon` | `Coupon\|null` | Applied coupon |
| `products` | `Collection<Product>` | Products (through items) |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `isPaymentProcessed($force)` | `bool` | Check payment status (`$force` queries DB directly) |
| `getLatestTrackingCode()` | `OrderTrackingCode\|null` | Most recent tracking code |
| `getCustomerVisibleNotes()` | `Collection<OrderNote>` | Notes visible to customer |

### Static Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `findByOrderHash($hash)` | `Order\|null` | Look up order by baseid |

### Complete Example

```twig
<div class="order-detail">
    <h2>Order #{{ order.order_number }}</h2>
    <span style="background: {{ order.status.color_background }};
                 color: {{ order.status.color_foreground }};
                 padding: 2px 8px; border-radius: 4px;">
        {{ order.status.name }}
    </span>

    <p>Placed on {{ order.ordered_at|date('M d, Y') }}</p>

    {# Items #}
    <table>
        <thead>
            <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            {% for item in order.items %}
                <tr>
                    <td>{{ item.outputProductName()|raw }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ item.display_price|currency }}</td>
                    <td>{{ item.display_line_price|currency }}</td>
                </tr>
            {% endfor %}
        </tbody>
    </table>

    {# Totals #}
    <dl>
        <dt>Subtotal</dt>
        <dd>{{ order.final_subtotal|currency }}</dd>

        {% if order.final_discount > 0 %}
            <dt>Discount</dt>
            <dd>-{{ order.final_discount|currency }}</dd>
        {% endif %}

        <dt>Shipping</dt>
        <dd>
            {% if order.shipping_is_free %}
                Free
            {% else %}
                {{ order.final_shipping_quote|currency }}
            {% endif %}
        </dd>

        {% for tax in order.all_taxes %}
            <dt>{{ tax.name }}</dt>
            <dd>{{ tax.amount|currency }}</dd>
        {% endfor %}

        <dt><strong>Total</strong></dt>
        <dd><strong>{{ order.total|currency }}</strong></dd>
    </dl>

    {# Addresses #}
    <div class="row">
        <div class="col">
            <h4>Billing Address</h4>
            <p>
                {{ order.billing_first_name }} {{ order.billing_last_name }}<br>
                {% if order.billing_company %}{{ order.billing_company }}<br>{% endif %}
                {{ order.billing_street_address }}<br>
                {{ order.billing_city }}, {{ order.billing_state.name }}
                {{ order.billing_zip }}<br>
                {{ order.billing_country.name }}
            </p>
        </div>
        <div class="col">
            <h4>Shipping Address</h4>
            <p>
                {{ order.shipping_first_name }} {{ order.shipping_last_name }}<br>
                {% if order.shipping_company %}{{ order.shipping_company }}<br>{% endif %}
                {{ order.shipping_street_address }}<br>
                {{ order.shipping_city }}, {{ order.shipping_state.name }}
                {{ order.shipping_zip }}<br>
                {{ order.shipping_country.name }}
            </p>
        </div>
    </div>

    {# Tracking #}
    {% if order.is_shipped %}
        <h4>Shipment Tracking</h4>
        {% for code in order.tracking_codes %}
            <div>
                <strong>{{ code.carrier|upper }}</strong>:
                {% if code.tracking_url %}
                    <a href="{{ code.tracking_url }}" target="_blank">
                        {{ code.tracking_number }}
                    </a>
                {% else %}
                    {{ code.tracking_number }}
                {% endif %}
                {% if code.shipped_at %}
                    — shipped {{ code.shipped_at|date('M d, Y') }}
                {% endif %}
            </div>
        {% endfor %}
    {% endif %}

    {# Status History #}
    <h4>Status History</h4>
    {% for log in order.status_log %}
        <div>
            <strong>{{ log.status.name }}</strong>
            <span>{{ log.created_at|date('M d, Y g:ia') }}</span>
            {% if log.comment %}
                <p>{{ log.comment }}</p>
            {% endif %}
        </div>
    {% endfor %}

    {# Pay Now link for unpaid orders #}
    {% if not order.is_payment_processed %}
        <a href="{{ 'shop/payment'|page({ hash: order.order_hash }) }}"
           class="btn btn-primary">
            Pay Now
        </a>
    {% endif %}
</div>
```

---

## OrderItem

Each line item within an order, representing a purchased product with its quantity, price, options, and extras.

### Core Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Primary key |
| `quantity` | `int` | Quantity ordered |
| `variant_id` | `int\|null` | Selected variant ID (null if no variant) |

### Price Properties (Per-Unit)

All per-unit values represent a single unit. The `price` field stores the discounted per-unit price. Multiply by `quantity` for line totals — or use the computed line price properties below.

| Property | Type | Description |
|----------|------|-------------|
| `price` | `int` | Per-unit price after discount (excluding tax) |
| `price_less_tax` | `int` | Per-unit price excluding tax |
| `price_with_tax` | `int` | Per-unit price including tax |
| `discount` | `int` | Per-unit discount amount (excluding tax) |
| `discount_less_tax` | `int` | Per-unit discount excluding tax |
| `discount_with_tax` | `int` | Per-unit discount including tax |
| `line_discount` | `int` | Exact total line discount across all units. Avoids rounding errors when per-unit discount doesn't divide evenly |
| `cost` | `int` | Per-unit cost of goods (for margin reporting) |
| `extras_price` | `int` | Per-unit extras price (excluding tax) |
| `extras_price_less_tax` | `int` | Per-unit extras price excluding tax |
| `extras_price_with_tax` | `int` | Per-unit extras price including tax |

### Price Properties (Line-Level)

Line-level values represent the total for the entire row (all units combined).

| Property | Type | Description |
|----------|------|-------------|
| `tax` | `int` | Total line tax: `unit_tax × quantity` |
| `subtotal` | `int` | Line subtotal: `quantity × original_price - line_discount` |
| `total` | `int` | Line total: `subtotal + tax` |

### Computed Price Properties

These are calculated on-the-fly and not stored in the database.

::: tip Unified Vocabulary
OrderItem supports the same unified price vocabulary as Product, ProductVariant, and CartItem. For Twig templates, prefer `display_price`, `compare_price`, `on_sale`, `display_discount`, and `display_line_price`. See [Pricing](./pricing) for details.
:::

| Property | Type | Description |
|----------|------|-------------|
| `display_price` | `int` | Customer-facing unit price with tax |
| `compare_price` | `int` | Pre-discount unit price with tax (the "was" price) |
| `on_sale` | `bool` | Whether the item has a discount |
| `display_discount` | `int` | Amount saved per unit: `compare_price - display_price` |
| `display_line_price` | `int` | Line total with tax: `unit_line_price + tax` |
| `original_price` | `int` | Pre-discount unit price: `price + discount` |
| `original_line_price` | `int` | Pre-discount line total: `quantity × original_price` |
| `unit_price` | `int` | Alias for `price` |
| `unit_line_price` | `int` | Line total after discount (no tax): `quantity × original_price - line_discount` |
| `final_price` | `int` | Alias for `price_with_tax` |
| `final_line_price` | `int` | Alias for `display_line_price` |
| `final_discount` | `int` | Alias for `discount_with_tax` |
| `total_cost` | `int` | Line cost: `quantity × cost` |
| `total_weight` | `float` | Line weight: `quantity × product.weight` |
| `total_volume` | `float` | Line volume: `quantity × product.volume` |

### Options and Extras

| Property | Type | Description |
|----------|------|-------------|
| `options` | `array<ProductOption>` | Selected options as ProductOption objects |
| `extras` | `array<ProductExtra>` | Selected extras as ProductExtra objects |
| `options_data` | `array` | Raw options JSON |
| `extras_data` | `array` | Raw extras JSON |
| `discount_data` | `array` | Applied price rule data |

### Bundle Properties

| Property | Type | Description |
|----------|------|-------------|
| `bundle_master_order_item_id` | `int\|null` | Parent bundle item ID |
| `bundle_master_bundle_item_id` | `int\|null` | Bundle slot definition ID |
| `bundle_master_bundle_item_name` | `string\|null` | Bundle slot name (e.g., "Processor") |

### Download Properties

| Property | Type | Description |
|----------|------|-------------|
| `download_key` | `string\|null` | Secure download token |
| `download_count` | `int` | Number of downloads used |
| `download_expires_at` | `Carbon\|null` | Download expiration date |

### Relationships

| Property | Type | Description |
|----------|------|-------------|
| `order` | `Order` | Parent order |
| `product` | `Product` | Purchased product |
| `variant` | `ProductVariant\|null` | Selected variant |
| `tax_class` | `TaxClass` | Tax class |
| `uploaded_files` | `Collection<File>` | Customer-uploaded files |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `outputProductName($options)` | `string` | Formatted name with options, extras, and bundle info |
| `isBundleItem()` | `bool` | Whether this is a bundle child item |
| `getMasterBundleOrderItem()` | `OrderItem\|null` | Parent bundle item |
| `listBundleItems()` | `Collection<OrderItem>` | Child bundle items |
| `isDownloadable()` | `bool` | Whether product has downloadable files |
| `canDownload()` | `bool` | Whether download is currently permitted |
| `isDownloadExpired()` | `bool` | Whether download link has expired |
| `isDownloadLimitReached()` | `bool` | Whether download limit is exceeded |
| `getDownloadUrl()` | `string\|null` | Public download URL |
| `getDownloadableFiles()` | `Collection<File>` | Available files for download |

### outputProductName Options

The `outputProductName()` method accepts an options array:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `outputName` | `bool` | `true` | Include the product name |
| `includeTax` | `bool` | `true` | Show prices with tax |
| `plainText` | `bool` | `false` | Plain text instead of HTML |
| `extraDetails` | `bool` | `false` | Include event-based details |

```twig
{# HTML output with formatted options and extras #}
{{ item.outputProductName()|raw }}

{# Plain text for emails #}
{{ item.outputProductName({ plainText: true }) }}
```

### Displaying Options and Extras

```twig
{# Selected options #}
{% for option in item.options %}
    <span>{{ option.name }}: {{ option.value }}</span>
{% endfor %}

{# Selected extras #}
{% for extra in item.extras %}
    <span>+ {{ extra.description }}: {{ extra.finalPrice|currency }}</span>
{% endfor %}
```

### Download Links

```twig
{% if item.isDownloadable() %}
    {% if item.canDownload() %}
        <a href="{{ item.getDownloadUrl() }}" class="btn btn-sm btn-success">
            Download
        </a>
        {% if item.download_count > 0 %}
            <small>(downloaded {{ item.download_count }} times)</small>
        {% endif %}
        {% if item.download_expires_at %}
            <small>Expires {{ item.download_expires_at|date('M d, Y') }}</small>
        {% endif %}
    {% elseif item.isDownloadExpired() %}
        <span class="text-muted">Download expired</span>
    {% elseif item.isDownloadLimitReached() %}
        <span class="text-muted">Download limit reached</span>
    {% endif %}
{% endif %}
```

### Displaying Variant and Bundle Info

```twig
{% for item in order.items %}
    <div class="{{ item.isBundleItem() ? 'bundle-child-item' }}">
        {# Bundle child slot name #}
        {% if item.bundle_master_bundle_item_name %}
            <em class="text-muted">{{ item.bundle_master_bundle_item_name }}</em>
        {% endif %}

        <strong>{{ item.product.name }}</strong>

        {# Variant name #}
        {% if item.variant_id %}
            <span class="text-muted">{{ item.variant.name }}</span>
        {% endif %}
    </div>
{% endfor %}
```

---

## OrderStatus

Represents an order status in the workflow system.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Primary key |
| `name` | `string` | Display name |
| `code` | `string` | Unique code identifier |
| `color_background` | `string` | Badge background color |
| `color_foreground` | `string` | Badge text color |
| `is_enabled` | `bool` | Whether status is active |

### Constants

| Constant | Value | Stock Action |
|----------|-------|-------------|
| `STATUS_NEW` | `new` | Reserves stock |
| `STATUS_PAID` | `paid` | Marks payment processed (no stock action) |
| `STATUS_SHIPPED` | `shipped` | Decrements stock and releases reservation |
| `STATUS_CANCELLED` | `cancelled` | Releases reservation |
| `STATUS_REFUNDED` | `refunded` | No stock action |

See [Inventory — Stock Lifecycle](./inventory#stock-lifecycle) for details on how status changes trigger stock operations.

### Static Helpers

| Method | Returns | Description |
|--------|---------|-------------|
| `getNewStatus()` | `OrderStatus` | Find the "new" status |
| `getPaidStatus()` | `OrderStatus` | Find the "paid" status |
| `getShippedStatus()` | `OrderStatus` | Find the "shipped" status |
| `getCancelledStatus()` | `OrderStatus` | Find the "cancelled" status |
| `getRefundedStatus()` | `OrderStatus` | Find the "refunded" status |

### Displaying Status

```twig
<span class="badge" style="background: {{ order.status.color_background }};
                            color: {{ order.status.color_foreground }}">
    {{ order.status.name }}
</span>
```

---

## OrderStatusLog

A record of each status change on an order.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Primary key |
| `comment` | `string\|null` | Comment added with the status change |
| `created_at` | `Carbon` | When the status change occurred |

### Relationships

| Property | Type | Description |
|----------|------|-------------|
| `status` | `OrderStatus` | The status that was applied |
| `order` | `Order` | The order |

### Displaying Status History

```twig
{% for log in order.status_log %}
    <div class="status-entry">
        <strong>{{ log.status.name }}</strong>
        <time>{{ log.created_at|date('M d, Y g:ia') }}</time>
        {% if log.comment %}
            <p>{{ log.comment }}</p>
        {% endif %}
    </div>
{% endfor %}
```

---

## OrderNote

Internal notes attached to an order by administrators, optionally visible to customers.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Primary key |
| `content` | `string` | Note text |
| `is_visible_to_customer` | `bool` | Whether customer can see this note |
| `created_at` | `Carbon` | When the note was created |

### Relationships

| Property | Type | Description |
|----------|------|-------------|
| `order` | `Order` | Parent order |
| `admin_user` | `AdminUser` | Backend user who wrote the note |

### Displaying Customer-Visible Notes

```twig
{% set notes = order.getCustomerVisibleNotes() %}
{% if notes is not empty %}
    <h4>Notes</h4>
    {% for note in notes %}
        <div class="order-note">
            <p>{{ note.content }}</p>
            <small>{{ note.created_at|date('M d, Y') }}</small>
        </div>
    {% endfor %}
{% endif %}
```

---

## OrderTrackingCode

Shipment tracking information attached to an order.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Primary key |
| `carrier` | `string` | Carrier code |
| `tracking_number` | `string` | Tracking number |
| `tracking_url` | `string\|null` | Auto-generated tracking URL |
| `shipped_at` | `Carbon\|null` | Shipment date |
| `created_at` | `Carbon` | When added to order |

### Carrier Constants

| Constant | Value | Tracking URL |
|----------|-------|-------------|
| `CARRIER_FEDEX` | `fedex` | `fedex.com/fedextrack/` |
| `CARRIER_UPS` | `ups` | `ups.com/track` |
| `CARRIER_USPS` | `usps` | `tools.usps.com/go/TrackConfirmAction` |
| `CARRIER_DHL` | `dhl` | `dhl.com/en/express/tracking.html` |
| `CARRIER_OTHER` | `other` | No automatic URL |

### Displaying Tracking

```twig
{% if order.is_shipped %}
    <h4>Tracking</h4>
    {% for code in order.tracking_codes %}
        <div>
            <strong>{{ code.carrier|upper }}</strong>:
            {% if code.tracking_url %}
                <a href="{{ code.tracking_url }}" target="_blank">
                    {{ code.tracking_number }}
                </a>
            {% else %}
                {{ code.tracking_number }}
            {% endif %}
            {% if code.shipped_at %}
                <span class="text-muted">
                    Shipped {{ code.shipped_at|date('M d, Y') }}
                </span>
            {% endif %}
        </div>
    {% endfor %}
{% endif %}
```

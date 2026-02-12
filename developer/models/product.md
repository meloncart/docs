---
subtitle: Product, Variant, Option, Extra, Property, PriceTier, and Bundle model reference.
---
# Product Models

This reference documents all Twig-accessible properties and methods for product-related models. All prices are stored as integers in **base currency units (cents)** — use the `|currency` filter for display.

## Product

The `Product` model is the central model for all product data. It is typically accessed via the [Catalog component](../components/catalog) as `product` or through category/group relationships.

### Core Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Primary key |
| `name` | `string` | Product name |
| `slug` | `string` | URL slug |
| `baseid` | `string` | Base identifier for URL generation |
| `sku` | `string` | SKU code |
| `title` | `string` | SEO/page title |
| `description` | `string` | Full description (HTML) |
| `short_description` | `string` | Short description |
| `is_enabled` | `bool` | Whether the product is active |
| `created_at` | `Carbon` | Creation date |
| `updated_at` | `Carbon` | Last update date |
| `available_at` | `Carbon` | Availability date (for pre-orders) |

### Price Properties

| Property | Type | Description |
|----------|------|-------------|
| `price` | `int` | Raw base price (no tax, no rules) |
| `cost` | `int` | Cost/wholesale price |
| `is_on_sale` | `bool` | Whether a discount applies (manual sale, catalog rules, or both) |
| `sale_price_or_discount` | `string` | Manual sale value: `"5000"` (fixed), `"20%"` (percent), or `"-500"` (offset) |
| `original_price` | `int` | Base price without tax — respects tier pricing and quantity |
| `original_sale_price` | `int` | Sale price without tax — checks manual sale, then catalog rules |
| `final_price` | `int` | Display price with tax (if tax display is enabled) |
| `final_sale_price` | `int` | Sale price with tax (if tax display is enabled) |
| `sale_price_reduction` | `int` | Amount saved: `original_price - original_sale_price` |

::: tip
Use `final_price` and `final_sale_price` for storefront display — they automatically apply tax display settings. Use `original_price` and `original_sale_price` when you need raw values without tax.
:::

```twig
{{ product.final_price|currency }}

{% if product.is_on_sale %}
    <del>{{ product.final_price|currency }}</del>
    <ins>{{ product.final_sale_price|currency }}</ins>
    <span>Save {{ product.sale_price_reduction|currency }}</span>
{% endif %}
```

### Physical Properties

| Property | Type | Description |
|----------|------|-------------|
| `weight` | `float` | Weight |
| `width` | `float` | Width |
| `height` | `float` | Height |
| `depth` | `float` | Depth |
| `volume` | `float` | Computed: `width × height × depth` |

### Inventory Properties

| Property | Type | Description |
|----------|------|-------------|
| `track_inventory` | `bool` | Whether stock is tracked |
| `units_in_stock` | `int` | Current stock quantity |
| `hide_if_out_of_stock` | `bool` | Hide product when out of stock |
| `allow_negative_stock` | `bool` | Allow stock to go below zero |
| `stock_alert_threshold` | `int` | Low stock notification threshold |
| `allow_pre_order` | `bool` | Accept orders when out of stock |

### Visibility Properties

| Property | Type | Description |
|----------|------|-------------|
| `is_visible_search` | `bool` | Show in search results |
| `is_visible_catalog` | `bool` | Show in catalog listings |
| `is_visible_user_group` | `bool` | Restrict visibility to specific user groups |

### Review Properties

| Property | Type | Description |
|----------|------|-------------|
| `reviews_rating` | `float` | Cached average rating (0–5) |
| `reviews_count` | `int` | Cached total approved reviews |

### Variant Properties

| Property | Type | Description |
|----------|------|-------------|
| `use_variants` | `bool` | Whether variants are enabled |
| `variant_generation` | `string` | Generation mode |
| `allow_price_tiers` | `bool` | Whether tier pricing is enabled |

### Relationships

| Property | Type | Description |
|----------|------|-------------|
| `categories` | `Collection<Category>` | Associated categories |
| `related_products` | `Collection<Product>` | Related products |
| `manufacturer` | `Manufacturer` | Manufacturer/brand |
| `product_type` | `ProductType` | Product type (controls feature flags) |
| `tax_class` | `TaxClass` | Tax class |
| `images` | `Collection<File>` | Product images |
| `files` | `Collection<File>` | Downloadable files |
| `options` | `Collection<ProductOption>` | Configurable options (Size, Color) |
| `extras` | `Collection<ProductExtra>` | Local extras (product-specific add-ons) |
| `all_extras` | `Collection<ProductExtra>` | Combined local extras + extra set extras |
| `properties` | `Collection<ProductProperty>` | Specifications (Material, Weight) |
| `price_tiers` | `Collection<PriceTier>` | Volume pricing tiers |
| `variants` | `Collection<ProductVariant>` | Product variants |
| `bundle_items` | `Collection<ProductBundleItem>` | Bundle slots |
| `reviews` | `Collection<ProductReview>` | Product reviews |
| `custom_groups` | `Collection<CustomGroup>` | Custom product groups |
| `user_groups` | `Collection<UserGroup>` | Visible-to user groups |
| `extra_sets` | `Collection<ProductExtraSet>` | Assigned extra option sets |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `pageUrl($pageName)` | `string` | CMS page URL for the product |
| `getBreadcrumbPath()` | `array\|null` | Parent category chain for breadcrumbs |
| `getPrimaryCategory()` | `Category\|null` | First associated category |
| `isVisible()` | `bool` | Whether product is enabled and not archived |
| `isOutOfStock()` | `bool` | Whether stock is below threshold |
| `getOriginalPrice($qty, $groupId)` | `int` | Base price with tier pricing |
| `getOriginalSalePrice($qty, $groupId)` | `int` | Sale price (manual or catalog rules) |
| `getFinalPrice($qty, $groupId)` | `int` | Display price with tax |
| `getFinalSalePrice($qty, $groupId)` | `int` | Sale price with tax |
| `getSalePriceReduction($qty, $groupId)` | `int` | Discount amount |
| `evalTierPrice($qty, $groupId)` | `int` | Evaluate tier price for quantity |
| `getCompiledRulePrice($qty, $groupId)` | `int\|null` | Catalog rule price (null if none) |
| `getAverageRating()` | `float` | Cached average review rating |
| `getReviewsCount()` | `int` | Cached approved review count |
| `resolveVariant($options)` | `ProductVariant\|null` | Find variant matching options |

### Complete Example

```twig
<div class="product-detail">
    {# Images #}
    {% for image in product.images %}
        <img src="{{ image.path|resize(600, 600) }}" alt="{{ product.name }}" />
    {% endfor %}

    <h1>{{ product.name }}</h1>
    <p class="sku">SKU: {{ product.sku }}</p>

    {# Manufacturer #}
    {% if product.manufacturer %}
        <p>By <a href="#">{{ product.manufacturer.name }}</a></p>
    {% endif %}

    {# Pricing #}
    {% if product.is_on_sale %}
        <del>{{ product.final_price|currency }}</del>
        <strong>{{ product.final_sale_price|currency }}</strong>
    {% else %}
        <strong>{{ product.final_price|currency }}</strong>
    {% endif %}

    {# Tier pricing #}
    {% if product.allow_price_tiers and product.price_tiers is not empty %}
        <table class="tier-pricing">
            <tr><th>Quantity</th><th>Price</th></tr>
            {% for tier in product.price_tiers %}
                <tr>
                    <td>{{ tier.quantity_label }}</td>
                    <td>{{ tier.price|currency }}</td>
                </tr>
            {% endfor %}
        </table>
    {% endif %}

    {# Stock #}
    {% if product.track_inventory %}
        {% if product.isOutOfStock() %}
            {% if product.allow_pre_order %}
                <span class="badge">Pre-Order</span>
            {% else %}
                <span class="badge">Out of Stock</span>
            {% endif %}
        {% else %}
            <span>{{ product.units_in_stock }} in stock</span>
        {% endif %}
    {% endif %}

    {# Options #}
    {% for option in product.options %}
        <div class="form-group">
            <label>{{ option.name }}</label>
            <select name="product_options[{{ option.name }}]">
                {% for value in option.values %}
                    <option value="{{ value }}">{{ value }}</option>
                {% endfor %}
            </select>
        </div>
    {% endfor %}

    {# Extras #}
    {% for extra in product.all_extras %}
        <label>
            <input type="checkbox" name="product_extras[{{ extra.id }}]" />
            {{ extra.description }}
            {% if extra.final_price > 0 %}
                (+{{ extra.final_price|currency }})
            {% endif %}
        </label>
    {% endfor %}

    {# Properties / Specifications #}
    {% if product.properties is not empty %}
        <h3>Specifications</h3>
        <dl>
            {% for property in product.properties %}
                <dt>{{ property.name }}</dt>
                <dd>{{ property.value }}</dd>
            {% endfor %}
        </dl>
    {% endif %}

    {# Related products #}
    {% if product.related_products is not empty %}
        <h3>Related Products</h3>
        {% for related in product.related_products %}
            <a href="{{ related.pageUrl() }}">{{ related.name }}</a>
        {% endfor %}
    {% endif %}

    {# Reviews summary #}
    {% if product.reviews_count > 0 %}
        <div>
            {{ product.reviews_rating|number_format(1) }}/5
            ({{ product.reviews_count }} reviews)
        </div>
    {% endif %}

    {# Description #}
    <div class="description">{{ product.description|raw }}</div>
</div>
```

---

## ProductOption

Options are selectable attributes like Size or Color. They determine which [variant](#productvariant) is selected when variants are enabled. Options do not add cost — use [extras](#productextra) for priced add-ons.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Primary key |
| `name` | `string` | Option name (e.g., "Color", "Size") |
| `values` | `array` | Available values (e.g., `["Red", "Blue", "Green"]`) |
| `hash` | `string` | MD5 hash of name (used as form field key) |
| `sort_order` | `int` | Display order |
| `value` | `string\|null` | Currently selected value (set in cart/order context) |

### Displaying Options

```twig
{# Product page — option selection #}
{% for option in product.options %}
    <div class="form-group">
        <label>{{ option.name }}</label>
        <select name="product_options[{{ option.name }}]">
            {% for value in option.values %}
                <option value="{{ value }}">{{ value }}</option>
            {% endfor %}
        </select>
    </div>
{% endfor %}

{# Cart/order context — selected value #}
{% for option in item.options %}
    <span>{{ option.name }}: {{ option.value }}</span>
{% endfor %}
```

::: info
When submitting to `onAddToCart`, options use `product_options[OptionName]` as the field name. The cart resolves the matching variant automatically.
:::

---

## ProductExtra

Extras are paid or free add-ons that customers can optionally select, such as gift wrapping, extended warranty, or engraving. Unlike options, extras have their own price and can affect weight and dimensions.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Primary key |
| `description` | `string` | Extra label/description |
| `group_name` | `string` | Group name for organizing extras |
| `price` | `int` | Raw price in cents |
| `original_price` | `int` | Price without tax |
| `final_price` | `int` | Price with tax (if tax display is enabled) |
| `weight` | `float` | Additional weight |
| `width` | `float` | Width |
| `height` | `float` | Height |
| `depth` | `float` | Depth |
| `volume` | `float` | Computed: `width × height × depth` |
| `hash` | `string` | MD5 hash of description |
| `sort_order` | `int` | Display order |
| `images` | `Collection<File>` | Extra images |

### Local vs Global Extras

- **Local extras** (`product.extras`) — defined directly on a product.
- **Global extras** — defined in an Extra Set and assigned to multiple products.
- **All extras** (`product.all_extras`) — merges both into a single collection.

Always use `product.all_extras` to display extras on the storefront.

### Displaying Extras

```twig
{% for extra in product.all_extras %}
    <label>
        <input type="checkbox" name="product_extras[{{ extra.id }}]" />
        {% if extra.group_name %}
            <strong>{{ extra.group_name }}:</strong>
        {% endif %}
        {{ extra.description }}
        {% if extra.final_price > 0 %}
            (+{{ extra.final_price|currency }})
        {% else %}
            (Free)
        {% endif %}
    </label>
{% endfor %}
```

### Extras in Cart/Order Context

When retrieved from a cart item or order item, extras have `originalPrice` and `finalPrice` properties set from the time of purchase:

```twig
{% for extra in item.extras %}
    <span>+ {{ extra.description }}: {{ extra.finalPrice|currency }}</span>
{% endfor %}
```

---

## ProductProperty

Properties are display-only specifications like Material, Dimensions, or Color. They have no effect on pricing or cart behavior — they are purely informational.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Primary key |
| `name` | `string` | Property name (e.g., "Material") |
| `value` | `string` | Property value (e.g., "Cotton") |
| `sort_order` | `int` | Display order |

### Displaying Properties

```twig
{% if product.properties is not empty %}
    <table class="specifications">
        <tbody>
            {% for property in product.properties %}
                <tr>
                    <th>{{ property.name }}</th>
                    <td>{{ property.value }}</td>
                </tr>
            {% endfor %}
        </tbody>
    </table>
{% endif %}
```

---

## ProductVariant

Variants are specific combinations of product options, each with its own SKU, price, stock, and dimensions. When a customer selects options (e.g., Color: Red, Size: Large), the system resolves the matching variant.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Primary key |
| `name` | `string` | Auto-generated name (e.g., "Red / Large") |
| `sku` | `string\|null` | Variant-specific SKU (falls back to product) |
| `price` | `int\|null` | Override price (null uses product price) |
| `cost` | `int\|null` | Override cost price |
| `compare_price` | `int\|null` | Compare-at price |
| `weight` | `float\|null` | Override weight |
| `width` | `float\|null` | Override width |
| `height` | `float\|null` | Override height |
| `depth` | `float\|null` | Override depth |
| `units_in_stock` | `int\|null` | Variant-specific stock |
| `stock_alert_threshold` | `int\|null` | Low stock threshold |
| `barcode` | `string` | Barcode/UPC |
| `is_enabled` | `bool` | Whether variant is available |
| `is_default` | `bool` | Default variant selection |

### Relationships

| Property | Type | Description |
|----------|------|-------------|
| `product` | `Product` | Parent product |
| `variant_options` | `Collection<ProductVariantOption>` | Selected option values |
| `variant_prices` | `Collection<VariantPrice>` | Tier/group pricing overrides |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getCompiledPrice($qty, $groupId)` | `int` | Resolved price with tiers and user groups |
| `getEffectiveWeight()` | `float` | Variant weight or product fallback |
| `getEffectiveWidth()` | `float` | Variant width or product fallback |
| `getEffectiveHeight()` | `float` | Variant height or product fallback |
| `getEffectiveDepth()` | `float` | Variant depth or product fallback |
| `getEffectiveSku()` | `string` | Variant SKU or product fallback |
| `getEffectiveUnitsInStock()` | `int` | Variant stock or product fallback |
| `isOutOfStock()` | `bool` | Whether variant is out of stock |

### Static Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `computeHash($options)` | `string` | Generate hash from option array |
| `findByOptions($product, $options)` | `ProductVariant\|null` | Find variant by options |

### How Variant Resolution Works

When a customer submits `product_options` with `onAddToCart`, the cart component calls `product.resolveVariant()` to find the matching variant:

1. The option values are normalized and hashed using `computeHash()`.
2. The hash is looked up in the variants table.
3. If found and enabled, the variant's price, SKU, and stock are used.
4. If not found, an exception is thrown.

```twig
{# Variant info in cart/order context #}
{% if item.variant %}
    <p>{{ item.variant.name }}</p>
    <p>SKU: {{ item.variant.getEffectiveSku() }}</p>
{% endif %}
```

---

## PriceTier

Price tiers provide volume-based pricing. When a customer adds a quantity that meets or exceeds a tier threshold, the tier price is used instead of the base price.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Primary key |
| `quantity` | `int` | Minimum quantity for this tier |
| `price` | `int` | Price at this tier (in cents) |
| `quantity_label` | `string` | Formatted label: "X or more" |
| `user_group_label` | `string` | User group name or "Any User" |

### Relationships

| Property | Type | Description |
|----------|------|-------------|
| `user_group` | `UserGroup\|null` | Restrict tier to a user group |

### Displaying Tier Pricing

```twig
{% if product.allow_price_tiers and product.price_tiers is not empty %}
    <h4>Volume Pricing</h4>
    <table>
        <thead>
            <tr><th>Quantity</th><th>Unit Price</th></tr>
        </thead>
        <tbody>
            {% for tier in product.price_tiers %}
                <tr>
                    <td>{{ tier.quantity_label }}</td>
                    <td>{{ tier.price|currency }}</td>
                </tr>
            {% endfor %}
        </tbody>
    </table>
{% endif %}
```

---

## ProductBundleItem

Bundle items represent slots within a bundle product. Each slot offers multiple product choices for the customer to select from.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Primary key |
| `name` | `string` | Slot name (e.g., "Processor", "Memory") |
| `description` | `string` | Slot description |
| `control_type` | `string` | UI control: `dropdown`, `radio`, or `checkbox` |
| `is_required` | `bool` | Whether a selection is mandatory |
| `sort_order` | `int` | Display order |

### Relationships

| Property | Type | Description |
|----------|------|-------------|
| `product` | `Product` | Parent bundle product |
| `item_products` | `Collection<BundleItemProduct>` | Available product choices |

## BundleItemProduct

Each product choice within a bundle slot, with optional price overrides.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Primary key |
| `product` | `Product` | The product being offered |
| `default_quantity` | `int` | Default quantity when selected |
| `allow_manual_quantity` | `bool` | Let customer change quantity |
| `is_default` | `bool` | Pre-selected by default |
| `is_active` | `bool` | Visible to customers |
| `price_override_mode` | `string` | Price mode: `default`, `fixed`, `fixed-discount`, `percentage-discount` |
| `price_or_discount` | `int` | Amount for the price mode (in cents) |
| `sort_order` | `int` | Display order |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getEffectivePrice()` | `int` | Calculated price based on override mode |

### Displaying Bundle Items

```twig
{% for slot in product.bundle_items %}
    <div class="bundle-slot">
        <h4>{{ slot.name }}{% if slot.is_required %} *{% endif %}</h4>
        {% if slot.description %}
            <p>{{ slot.description }}</p>
        {% endif %}

        {% if slot.control_type == 'dropdown' %}
            <select name="bundle_items[{{ slot.id }}]"
                    {% if slot.is_required %}required{% endif %}>
                <option value="">— Select —</option>
                {% for choice in slot.item_products %}
                    {% if choice.is_active %}
                        <option value="{{ choice.product.id }}"
                                {% if choice.is_default %}selected{% endif %}>
                            {{ choice.product.name }}
                            ({{ choice.getEffectivePrice()|currency }})
                        </option>
                    {% endif %}
                {% endfor %}
            </select>

        {% elseif slot.control_type == 'radio' %}
            {% for choice in slot.item_products %}
                {% if choice.is_active %}
                    <label>
                        <input type="radio" name="bundle_items[{{ slot.id }}]"
                               value="{{ choice.product.id }}"
                               {% if choice.is_default %}checked{% endif %} />
                        {{ choice.product.name }}
                        ({{ choice.getEffectivePrice()|currency }})
                    </label>
                {% endif %}
            {% endfor %}

        {% elseif slot.control_type == 'checkbox' %}
            {% for choice in slot.item_products %}
                {% if choice.is_active %}
                    <label>
                        <input type="checkbox" name="bundle_items[{{ slot.id }}][]"
                               value="{{ choice.product.id }}"
                               {% if choice.is_default %}checked{% endif %} />
                        {{ choice.product.name }}
                        ({{ choice.getEffectivePrice()|currency }})
                    </label>
                {% endif %}
            {% endfor %}
        {% endif %}
    </div>
{% endfor %}
```

---

## ProductType

Product types control which features and tabs are available on the product form. They are primarily a backend concept, but can be useful in templates to conditionally render features.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Primary key |
| `name` | `string` | Type name |
| `code` | `string` | API code |
| `has_files` | `bool` | Supports downloadable files |
| `has_shipping` | `bool` | Requires shipping |
| `has_inventory` | `bool` | Tracks inventory |
| `has_options` | `bool` | Supports options |
| `has_extras` | `bool` | Supports extras |
| `has_bundles` | `bool` | Supports bundles |
| `has_variants` | `bool` | Supports variants |
| `is_default` | `bool` | Default type for new products |

### Using in Templates

```twig
{% if product.product_type.has_shipping %}
    <p>Ships within 3-5 business days</p>
{% else %}
    <p>Digital delivery — instant access after purchase</p>
{% endif %}

{% if product.product_type.has_files %}
    <p>Includes downloadable files</p>
{% endif %}
```

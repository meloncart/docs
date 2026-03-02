---
subtitle: AJAX-powered product filtering for category pages.
---
# Catalog Filtering

The Commerce Theme includes an AJAX-powered filtering system for category pages. Customers can filter products by manufacturer, star rating, and price range — all without a full page reload.

## How It Works

The filtering system uses three layers:

1. **Sidebar filter controls** — Twig partials with checkboxes and a price slider
2. **The `catalog-form` JavaScript control** — Collects filter state and sends AJAX requests
3. **The `listProducts()` method** — Accepts filter parameters and returns matching products

When a customer interacts with any filter, the `catalog-form` control gathers all active filters and sends a single AJAX request to refresh the product listing.

## Page Setup

The category page wraps the sidebar and content area in a `data-control="catalog-form"` container:

```twig
{# pages/shop/category.htm #}
<div class="row" data-control="catalog-form">
    <aside class="col-lg-3">
        {% partial 'shop-category/sidebar-categories' %}
        {% partial 'shop-category/sidebar-manufacturers' %}
        {% partial 'shop-category/sidebar-price' %}
        {% partial 'shop-category/sidebar-rating' %}
    </aside>
    <section class="col-lg-9">
        <div id="categoryProducts">
            {% ajaxPartial 'shop-category/category-products' %}
        </div>
    </section>
</div>
```

## Manufacturer Filter

The manufacturer sidebar renders checkboxes for each available manufacturer. Each checkbox uses the `data-filter-manufacturer` attribute so the `catalog-form` control can detect changes.

```twig
{# partials/shop-category/sidebar-manufacturers.htm #}
{% set manufacturers = catalog.allManufacturers %}
{% if manufacturers is not empty %}
    <div class="mb-8">
        <h5 class="mb-3">Manufacturers</h5>
        {% for manufacturer in manufacturers %}
            <div class="form-check mb-2">
                <input
                    class="form-check-input"
                    type="checkbox"
                    value="{{ manufacturer.id }}"
                    id="manufacturer{{ manufacturer.id }}"
                    data-filter-manufacturer>
                <label class="form-check-label" for="manufacturer{{ manufacturer.id }}">
                    {{ manufacturer.name }}
                </label>
            </div>
        {% endfor %}
    </div>
{% endif %}
```

When no checkboxes are selected, all manufacturers are shown. Checking one or more filters to only those manufacturers.

## Rating Filter

The rating sidebar renders star-based checkboxes using the reusable `ui/star-rating-display` partial. Each checkbox uses `data-filter-rating`.

```twig
{# partials/shop-category/sidebar-rating.htm #}
<div class="mb-8">
    <h5 class="mb-3">Rating</h5>
    <div>
        {% for star in 5..1 %}
            <div class="form-check mb-2">
                <input
                    class="form-check-input"
                    type="checkbox"
                    value="{{ star }}"
                    id="rating{{ star }}"
                    data-filter-rating>
                <label class="form-check-label" for="rating{{ star }}">
                    {% partial 'ui/star-rating-display' rating=star %}
                </label>
            </div>
        {% endfor %}
    </div>
</div>
```

Selecting a rating (e.g., 4 stars) matches products with a `reviews_rating` between 4.00 and 4.99. Multiple ratings can be selected.

## Price Range Filter

The price slider uses the `price-slider` JavaScript control with [noUiSlider](https://refreshless.com/nouislider/). It reads its range from the category's actual product prices via `category.priceRange()`.

```twig
{# partials/shop-category/sidebar-price.htm #}
{% set priceRange = category.priceRange() %}
{% set cur = currency() %}
{% if priceRange.max > priceRange.min %}
    <div
        data-control="price-slider"
        data-min="{{ priceRange.min }}"
        data-max="{{ priceRange.max }}"
        data-decimal-scale="{{ cur.decimal_scale }}"
        data-currency-symbol="{{ cur.currency_symbol }}"
        data-symbol-before="{{ cur.place_symbol_before ? 'true' : 'false' }}"
        data-thousand-separator="{{ cur.thousand_separator }}"
        class="mb-8"
    >
        <h5 class="mb-3">Price</h5>
        <div>
            <div data-price-range-slider class="mb-3"></div>
            <small class="text-muted">Price:</small>
            <span data-price-range-text class="small"></span>
        </div>
    </div>
{% endif %}
```

### Price Values

All prices in Meloncart are stored as **base values** (e.g., cents). A price of `$19.99` is stored as `1999`. The slider works entirely with base values:

- `category.priceRange()` returns `{min, max}` in base values
- The slider dispatches a `price-change` event with base values
- The `listProducts()` method receives `priceMin` and `priceMax` as base values
- The `price-slider` control handles display formatting using the currency settings

### Currency Settings

The `currency()` Twig function returns the default currency model, providing access to formatting properties:

| Property | Type | Example | Description |
|----------|------|---------|-------------|
| `currency_symbol` | string | `$` | The currency symbol |
| `decimal_scale` | int | `2` | Number of decimal places (used to convert base values) |
| `decimal_point` | string | `.` | Decimal separator character |
| `thousand_separator` | string | `,` | Thousands separator character |
| `place_symbol_before` | bool | `true` | Whether the symbol appears before the number |

### price-slider Data Attributes

| Attribute | Description |
|-----------|-------------|
| `data-min` | Minimum slider value (base value) |
| `data-max` | Maximum slider value (base value) |
| `data-decimal-scale` | Currency decimal scale for display conversion |
| `data-currency-symbol` | Currency symbol for display |
| `data-symbol-before` | `"true"` or `"false"` — symbol placement |
| `data-thousand-separator` | Thousands separator for display |

## The catalog-form Control

The `catalog-form` JavaScript control (`assets/js/controls/catalog-form.js`) ties everything together. It listens for:

- `change` events on `[data-filter-manufacturer]` checkboxes
- `change` events on `[data-filter-rating]` checkboxes
- `price-change` custom events from `[data-control="price-slider"]`

On any filter change, it collects all active filter values and sends a single AJAX request:

```js
oc.request(this.element, 'onAction', {
    data: {
        manufacturers: [1, 3],    // checked manufacturer IDs
        ratings: [4, 5],          // checked star values
        priceMin: 1000,           // slider min (base value)
        priceMax: 50000           // slider max (base value)
    },
    update: {
        'shop-category/category-products': '#categoryProducts'
    }
});
```

Empty arrays and undefined values are omitted — when no filter is active for a given type, all products match.

## Category Products Partial

The category products partial reads the filter values from the POST data and passes them to `listProducts()`:

```twig
{# partials/shop-category/category-products.htm #}
{% set products = category.listProducts({
    sorting: sortingPreference,
    manufacturers: post('manufacturers'),
    ratings: post('ratings'),
    priceMin: post('priceMin'),
    priceMax: post('priceMax')
}) %}
```

## Adding Custom Filters

To add a new filter type:

1. **Create a sidebar partial** with inputs that have a `data-filter-*` attribute
2. **Add a listener** in `catalog-form.js` for the new attribute
3. **Collect values** in the `onFilterProducts()` method and add to the `data` object
4. **Add the option** to `Category::listProducts()` with the corresponding query logic
5. **Pass the value** in the category products partial via `post('yourFilter')`

For example, to add a "In Stock" toggle:

```twig
{# Sidebar partial #}
<div class="form-check">
    <input class="form-check-input" type="checkbox" value="1" data-filter-instock>
    <label class="form-check-label">In Stock Only</label>
</div>
```

```js
// In catalog-form.js connect()
this.listen('change', '[data-filter-instock]', this.onFilterProducts);

// In onFilterProducts()
const inStock = this.element.querySelector('[data-filter-instock]:checked');
if (inStock) {
    data.inStock = true;
}
```

```php
// In Category::listProducts()
if ($inStock) {
    $query->where('units_in_stock', '>', 0);
}
```

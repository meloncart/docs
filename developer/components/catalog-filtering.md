---
subtitle: AJAX-powered product filtering for category pages.
---
# Catalog Filtering

The Commerce Theme includes an AJAX-powered filtering system for category pages. Customers can filter products by manufacturer, star rating, price range, and product attributes (properties and options), all without a full page reload.

## How It Works

The filtering system uses three layers:

1. **Sidebar filter controls**: Twig partials with checkboxes and a price slider
2. **The `catalog-form` JavaScript control**: Collects filter state and sends AJAX requests
3. **The `listProducts()` method**: Proxies to `Product::listFrontEnd()` with filter parameters and returns matching products

When a customer interacts with any filter, the `catalog-form` control gathers all active filters and sends a single AJAX request to refresh the product listing.

## Page Setup

The category page wraps the sidebar and content area in a `data-control="catalog-form"` container:

```twig
{# pages/shop/category.htm #}
<div class="row" data-control="catalog-form">
    <aside class="col-lg-3">
        {% partial 'shop-category/sidebar-categories' %}
        {% partial 'shop-category/sidebar-manufacturers' %}
        {% partial 'shop-category/sidebar-filters' %}
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

## Product Filters

Product filters provide faceted navigation based on product properties and options. Unlike manufacturer and rating filters which are fixed, product filters are dynamic: they are auto-created from the properties and options you add to your products.

### How Product Filters Work

When a product property or option is saved, a **filter definition** is automatically created in the backend (e.g., saving a "Color" property creates a "Color" filter definition). A denormalized **filter index** maps products to their filter values, enabling fast filtering without complex joins.

Merchants can manage filter definitions under **Shop → Products → Manage → Product Filters**. Each definition has an **is_filterable** toggle that controls whether it appears in the sidebar, and a **control type** that determines how the filter is rendered. Filter definitions can be reordered to control their display order.

### Control Types

Each filter definition has a **control type** that determines how it renders in the sidebar:

| Type | Description |
|------|-------------|
| `checkbox` | Multi-select checkboxes (default). Customers can select multiple values. |
| `dropdown` | Single-select dropdown. Shows an "All" option when nothing is selected. |
| `radio` | Single-select radio buttons. Includes an "All" option to clear the selection. |
| `color` | Toggle buttons styled as swatches. Behaves like checkboxes (multi-select). |

### Sidebar Partial

The filter sidebar uses `category.availableFilters()` to get the facets relevant to the current category. Each facet includes a `type` property from its filter definition, which the partial uses to render the appropriate control. All controls use the `data-filter-facet` attribute so the `catalog-form` control can detect changes.

```twig
{# partials/shop-category/sidebar-filters.htm #}
{% if category %}
    {% set facets = category.availableFilters() %}
{% endif %}
{% if facets is not empty %}
    {% for facet in facets %}
        <div class="mb-8">
            <h5 class="mb-3">
                {{ facet.name }}
            </h5>
            {% if facet.type == 'dropdown' %}
                <select
                    class="form-select"
                    data-filter-facet="{{ facet.code }}">
                    <option value="">
                        All
                    </option>
                    {% for item in facet.values %}
                        <option value="{{ item.value }}">
                            {{ item.value }} ({{ item.count }})
                        </option>
                    {% endfor %}
                </select>
            {% elseif facet.type == 'radio' %}
                <div class="form-check mb-2">
                    <input
                        class="form-check-input"
                        type="radio"
                        value=""
                        id="filter_{{ facet.code }}_all"
                        name="filter_{{ facet.code }}"
                        data-filter-facet="{{ facet.code }}"
                        checked>
                    <label class="form-check-label" for="filter_{{ facet.code }}_all">
                        All
                    </label>
                </div>
                {% for item in facet.values %}
                    <div class="form-check mb-2">
                        <input
                            class="form-check-input"
                            type="radio"
                            value="{{ item.value }}"
                            id="filter_{{ facet.code }}_{{ loop.index }}"
                            name="filter_{{ facet.code }}"
                            data-filter-facet="{{ facet.code }}">
                        <label class="form-check-label" for="filter_{{ facet.code }}_{{ loop.index }}">
                            {{ item.value }}
                            <small class="text-muted">
                                ({{ item.count }})
                            </small>
                        </label>
                    </div>
                {% endfor %}
            {% elseif facet.type == 'color' %}
                <div class="d-flex flex-wrap gap-2">
                    {% for item in facet.values %}
                        <input
                            type="checkbox"
                            class="btn-check"
                            value="{{ item.value }}"
                            id="filter_{{ facet.code }}_{{ loop.index }}"
                            data-filter-facet="{{ facet.code }}"
                            autocomplete="off">
                        <label
                            class="btn btn-outline-secondary btn-sm"
                            for="filter_{{ facet.code }}_{{ loop.index }}"
                            title="{{ item.value }} ({{ item.count }})">
                            {{ item.value }}
                        </label>
                    {% endfor %}
                </div>
            {% else %}
                {% for item in facet.values %}
                    <div class="form-check mb-2">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            value="{{ item.value }}"
                            id="filter_{{ facet.code }}_{{ loop.index }}"
                            data-filter-facet="{{ facet.code }}">
                        <label class="form-check-label" for="filter_{{ facet.code }}_{{ loop.index }}">
                            {{ item.value }}
                            <small class="text-muted">
                                ({{ item.count }})
                            </small>
                        </label>
                    </div>
                {% endfor %}
            {% endif %}
        </div>
    {% endfor %}
{% endif %}
```

The `availableFilters()` method returns an array of facets, each with a `code`, `name`, `type`, and `values` array. Each value has a `value` string and a `count` of matching products. Only filterable definitions with products in the current category are included.

### Filter Data Structure

The `catalog-form` control collects all `[data-filter-facet]` elements into a `filters` object keyed by filter code. It handles checkboxes, radio buttons, and select elements automatically:

```js
data.filters = {
    color: ['Red', 'Blue'],
    size: ['Large']
};
```

Multiple values within the same facet use OR logic (Red OR Blue), while different facets use AND logic (Color AND Size). The category products partial passes the filters through to `listProducts()`:

```twig
{% set products = category.listProducts({
    filters: post('filters', [])
}) %}
```

### Translation Support

Filter definitions, codes, and values are fully translatable. In a multilingual store, the sidebar labels, URL parameter codes, and filter values are all locale-specific. For example, an English store shows `Color: Red, Blue` while a French store shows `Couleur: Rouge, Bleu`.

### Rebuilding the Index

If the filter index gets out of sync, use the artisan command to rebuild it from source data:

```bash
php artisan shop:rebuild-filters
```

This truncates and repopulates the entire index from product properties and options.

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
| `data-symbol-before` | `"true"` or `"false"`: symbol placement |
| `data-thousand-separator` | Thousands separator for display |

## The catalog-form Control

The `catalog-form` JavaScript control (`assets/js/controls/catalog-form.js`) ties everything together. It listens for:

- `change` events on `[data-filter-manufacturer]` checkboxes
- `change` events on `[data-filter-facet]` checkboxes
- `change` events on `[data-filter-rating]` checkboxes
- `price-change` custom events from `[data-control="price-slider"]`

On any filter change, it collects all active filter values and sends a single AJAX request:

```js
oc.request(this.element, 'onRefreshCatalog', {
    data: {
        manufacturers: [1, 3],    // checked manufacturer IDs
        filters: {                // product filter facets
            color: ['Red', 'Blue'],
            size: ['Large']
        },
        ratings: [4, 5],          // checked star values
        priceMin: 1000,           // slider min (base value)
        priceMax: 50000           // slider max (base value)
    },
    update: {
        'shop-category/category-products': '#categoryProducts'
    }
});
```

Empty arrays and undefined values are omitted: when no filter is active for a given type, all products match.

## Category Products Partial

The category products partial reads the filter values from the POST data and passes them to `listProducts()`:

```twig
{# partials/shop-category/category-products.htm #}
{% set products = category.listProducts({
    sort: sortPreference,
    manufacturers: post('manufacturers'),
    ratings: post('ratings'),
    priceMin: post('priceMin'),
    priceMax: post('priceMax'),
    filters: post('filters', [])
}) %}
```

## Adding Custom Filters

To add a new filter type:

1. **Create a sidebar partial** with inputs that have a `data-filter-*` attribute
2. **Add a listener** in `catalog-form.js` for the new attribute
3. **Collect values** in the `onFilterProducts()` method and add to the `data` object
4. **Add the option** to `Product::listFrontEnd()` with the corresponding query logic
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
// In Product\HasScopes::scopeListFrontEnd()
if ($inStock) {
    $query->where('units_in_stock', '>', 0);
}
```

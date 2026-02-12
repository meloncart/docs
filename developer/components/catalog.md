---
subtitle: View product categories in the catalog.
---
# Catalog

The `catalog` component loads products, categories, and manufacturers from the database and makes them available as page variables. It is the primary component for building product detail pages, category listing pages, and shop navigation.

## Component Declaration

```ini
[catalog]
lookup = "product"
identifier = "baseid"
```

### Properties

| Property | Type | Options | Description |
| --- | --- | --- | --- |
| `lookup` | dropdown | `category`, `product`, `manufacturer` | The type of object to load on page run |
| `identifier` | dropdown | `slug`, `fullslug`, `baseid`, `id`, *(empty)* | The column used to find the record |
| `value` | string | | A static lookup value. If omitted, the value is taken from the URL parameter matching the identifier name |

When the page loads, the component queries the database for a record where `identifier = value` and sets it as a page variable. For example, with `lookup = "product"` and `identifier = "baseid"`, the component finds the product whose `baseid` column matches the `:baseid` URL parameter.

If `value` is left empty (the usual case), the component reads the value from the URL. If `value` is set explicitly, it always uses that static value regardless of the URL.

Setting `identifier` to empty disables the automatic lookup. The component still provides its Twig query methods but does not set any page variable on run.

## Page Variables

On page load, the component sets one of these page variables depending on the `lookup` property:

| Lookup | Page Variable | Type | Description |
| --- | --- | --- | --- |
| `product` | `product` | Product | The matched product model |
| `category` | `category` | Category | The matched category model |
| `manufacturer` | `manufacturer` | Manufacturer | The matched manufacturer model |

If no record matches the lookup, the page variable is not set. You should check for this and return a 404:

```twig
{% if not product %}
    {% do abort(404) %}
{% endif %}
```

## Twig API

### catalog.category()

Returns the current category from the lookup, or `null` if the lookup type is not `category` or no match was found.

### catalog.product()

Returns the current product from the lookup, or `null`.

### catalog.allCategories()

Returns all visible categories (where `is_hidden` is false) as a hierarchical collection. Useful for building navigation menus and category trees.

```twig
{% set categories = catalog.allCategories %}
{% for category in categories %}
    <a href="{{ category.pageUrl('shop/category') }}">{{ category.name }}</a>
    {% if category.children.count %}
        <ul>
            {% for child in category.children %}
                <li><a href="{{ child.pageUrl('shop/category') }}">{{ child.name }}</a></li>
            {% endfor %}
        </ul>
    {% endif %}
{% endfor %}
```

### catalog.categoryQuery()

Returns a new Category model instance for building custom queries.

```twig
{% set topCategories = catalog.categoryQuery.applyVisible.where('parent_id', null).get() %}
```

### catalog.productQuery()

Returns a new Product model instance for building custom queries.

```twig
{% set newProducts = catalog.productQuery.applyVisible.orderBy('created_at', 'desc').take(8).get() %}
```

### catalog.customGroupQuery()

Returns a new CustomGroup model instance for building custom queries.

### catalog.findCustomGroup(code)

Finds a custom group by its code and returns it. Custom groups are named collections of products defined in the backend (e.g., "Featured Products", "Best Sellers").

```twig
{% set featured = catalog.findCustomGroup('featured-products') %}
{% if featured %}
    {% for product in featured.products %}
        {% partial 'shop/product-card' product=product %}
    {% endfor %}
{% endif %}
```

## URL Routing Patterns

The Catalog component works with October CMS URL parameters. The URL pattern in your page definition determines which parameters are available for the identifier lookup.

### Product Page

```ini
url = "/shop/product/:slug*/:baseid"

[catalog]
lookup = "product"
identifier = "baseid"
```

The `:slug*` parameter is a wildcard that captures the product slug (used for SEO-friendly URLs). The `:baseid` parameter is what the component actually uses for the lookup. This pattern supports URLs like:

```
/shop/product/blue-widget/a1b2c3d4
/shop/product/electronics/blue-widget/a1b2c3d4
```

### Category Page

```ini
url = "/shop/category/:fullslug*?/:baseid?"

[catalog]
lookup = "category"
identifier = "baseid"
```

The `?` suffix makes parameters optional. The `:fullslug*?` captures the hierarchical category path (e.g., `electronics/phones`) and `:baseid?` is the category's base identifier. This supports URLs like:

```
/shop/category/electronics/a1b2c3d4
/shop/category/electronics/phones/b2c3d4e5
```

### Slug Redirect Pattern

When using `baseid` as the identifier, the slug portion of the URL is cosmetic. If a product's slug changes, old URLs with the wrong slug still work because the lookup uses `baseid`. However, you should redirect to the canonical URL for SEO:

```twig
{% if not product %}
    {% do abort(404) %}
{% elseif product.fullslug and product.fullslug != this.param.fullslug %}
    {% do redirect(this|page({ fullslug: product.fullslug }), 301) %}
{% endif %}
```

This pattern checks if the slug in the URL matches the product's current slug. If not, it issues a 301 redirect to the correct URL.

## Product Model Properties

These properties are available on Product objects in Twig templates.

### Core Properties

| Property | Type | Description |
| --- | --- | --- |
| `name` | string | Product name |
| `slug` | string | URL slug |
| `baseid` | string | Base identifier |
| `sku` | string | Stock keeping unit |
| `description` | string | Full HTML description |
| `short_description` | string | Brief plain text description |
| `title` | string | Display title (if different from name) |
| `weight` | float | Product weight |
| `width` | float | Product width |
| `height` | float | Product height |
| `depth` | float | Product depth |
| `volume` | float | Calculated volume (width × height × depth) |

### Price Properties

All prices are integers in cents.

| Property | Type | Description |
| --- | --- | --- |
| `price` | integer | Base price as entered in the backend |
| `final_price` | integer | Price with tax (no sale discount) |
| `final_sale_price` | integer | Customer-facing price with sales, tier pricing, catalog rules, and tax |
| `original_price` | integer | Base price without tax |
| `original_sale_price` | integer | Sale price without tax |
| `on_sale` | boolean | Whether a sale price is active |
| `sale_price_reduction` | integer | Amount saved off the regular price |

### Relationships

| Property | Type | Description |
| --- | --- | --- |
| `images` | Collection | Product images (File attachments) |
| `files` | Collection | Downloadable files (File attachments) |
| `categories` | Collection | Assigned categories |
| `options` | Collection | Product options (Size, Color, etc.) |
| `all_extras` | Collection | All extras including those from extra sets |
| `extras` | Collection | Product-specific extras only |
| `properties` | Collection | Product properties/specifications |
| `variants` | Collection | Product variants |
| `related_products` | Collection | Related products |
| `manufacturer` | Manufacturer\|null | Assigned manufacturer |

### Inventory Properties

| Property | Type | Description |
| --- | --- | --- |
| `track_inventory` | boolean | Whether inventory tracking is enabled |
| `units_in_stock` | integer | Current stock level |
| `allow_pre_order` | boolean | Whether pre-orders are allowed when out of stock |

### Visibility Properties

| Property | Type | Description |
| --- | --- | --- |
| `is_enabled` | boolean | Whether the product is active |
| `is_visible_search` | boolean | Whether visible in search results |
| `is_visible_catalog` | boolean | Whether visible in category listings |

### Methods

| Method | Return | Description |
| --- | --- | --- |
| `pageUrl('page-name')` | string | CMS page URL for this product |
| `breadcrumbPath` | array\|null | Chain of parent categories for breadcrumbs |
| `primaryCategory` | Category\|null | The first assigned category |
| `isOutOfStock()` | boolean | Whether the product is out of stock |

## Category Model Properties

### Core Properties

| Property | Type | Description |
| --- | --- | --- |
| `name` | string | Category name |
| `slug` | string | URL slug |
| `fullslug` | string | Hierarchical slug (e.g., `electronics/phones`) |
| `baseid` | string | Base identifier |
| `code` | string | Unique code |
| `title` | string | Display title (if different from name) |
| `description` | string | Full description |
| `short_description` | string | Brief description |

### Relationships

| Property | Type | Description |
| --- | --- | --- |
| `images` | Collection | Category images |
| `products` | Collection | Products in this category |
| `children` | Collection | Child categories |
| `parent` | Category\|null | Parent category |

### Methods

| Method | Return | Description |
| --- | --- | --- |
| `pageUrl('page-name')` | string | CMS page URL for this category |
| `countProducts()` | integer | Number of products in this category |
| `listProducts(options)` | Paginator | Paginated product listing |
| `breadcrumbPath` | array\|null | Chain of parent categories |

### listProducts Options

The `listProducts()` method accepts an options array:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | integer | `1` | Page number for pagination |
| `perPage` | integer | `30` | Products per page |
| `sorting` | string | `created_at` | Sort column (e.g., `name`, `price asc`, `price desc`) |
| `search` | string | `''` | Search query to filter products |

## Complete Examples

### Product Page

```twig
{# pages/shop/product.htm #}
##
url = "/shop/product/:slug*/:baseid"
layout = "default"
title = "Shop Product"
meta_title = "{{ product.name }}"

[cart]
[catalog]
lookup = "product"
identifier = "baseid"
==
{% if not product %}
    {% do abort(404) %}
{% elseif product.fullslug and product.fullslug != this.param.fullslug %}
    {% do redirect(this|page({ fullslug: product.fullslug }), 301) %}
{% endif %}

<div class="container">
    {% partial 'shop/breadcrumb' object=product %}

    <div class="row">
        <div class="col-md-5">
            {% if product.on_sale %}
                <span class="badge bg-danger">On Sale!</span>
            {% endif %}
            {% if product.images is not empty %}
                <img class="img-fluid"
                    src="{{ product.images.first|resize(500, 500, { mode: 'auto' }) }}"
                    alt="{{ product.name }}" />
            {% endif %}
        </div>
        <div class="col-md-7">
            {% if product.primaryCategory %}
                <a href="{{ product.primaryCategory.pageUrl('shop/category') }}">
                    {{ product.primaryCategory.name }}
                </a>
            {% endif %}

            <h1>{{ product.title ? product.title : product.name }}</h1>

            <div class="fs-4">
                <span class="fw-bold">{{ product.final_sale_price|currency }}</span>
                {% if product.on_sale %}
                    <span class="text-decoration-line-through text-muted">
                        {{ product.final_price|currency }}
                    </span>
                {% endif %}
            </div>

            <form>
                {% partial 'shop/product-options' %}
                {% partial 'shop/product-extra-options' %}
                {% partial 'shop/add-to-cart-control' %}
            </form>

            {% if product.description %}
                <div class="mt-4">{{ product.description|raw }}</div>
            {% endif %}
        </div>
    </div>
</div>
```

### Category Page

```twig
{# pages/shop/category.htm #}
##
url = "/shop/category/:fullslug*?/:baseid?"
layout = "default"
title = "Shop Category"

[cart]
[catalog]
lookup = "category"
identifier = "baseid"
==
{% if not category %}
    {% do abort(404) %}
{% elseif category.fullslug and category.fullslug != this.param.fullslug %}
    {% do redirect(this|page({ fullslug: category.fullslug }), 301) %}
{% endif %}

{% set subcategories = category.children %}

<div class="container">
    {% partial 'shop/breadcrumb' object=category %}

    <div class="row">
        <aside class="col-lg-3">
            {% if category.short_description %}
                <p>{{ category.short_description }}</p>
            {% endif %}

            {% if subcategories.count %}
                <h4>Subcategories</h4>
                <ul>
                    {% for subcategory in subcategories %}
                        <li>
                            <a href="{{ subcategory.pageUrl('shop/category') }}">
                                {{ subcategory.name }}
                            </a>
                        </li>
                    {% endfor %}
                </ul>
            {% endif %}
        </aside>
        <section class="col-lg-9">
            <h1>{{ category.title ? category.title : category.name }}</h1>

            {% if category.countProducts %}
                <div id="categoryProducts">
                    {% ajaxPartial 'shop/category-products' %}
                </div>
            {% else %}
                <p>This category does not contain any products.</p>
            {% endif %}
        </section>
    </div>
</div>
```

### Category Products with AJAX Sorting

The category products partial demonstrates AJAX-powered sorting and view mode toggling without a full page reload:

```twig
{# partials/shop/category-products.htm #}
{% if post('sorting') %}
    {% do this.session.put('cat_sorting_' ~ category.id, post('sorting')) %}
{% endif %}
{% if post('view_mode') %}
    {% do this.session.put('cat_view_' ~ category.id, post('view_mode')) %}
{% endif %}

{% set sortingPreference = this.session.get('cat_sorting_' ~ category.id, 'name') %}
{% set viewMode = this.session.get('cat_view_' ~ category.id, 'list') %}

{% set sortingOptions = {
    name: 'Name',
    'price desc': 'Price (high to low)',
    'price asc': 'Price (low to high)'
} %}

{% set products = category.listProducts({ sorting: sortingPreference }) %}

<div class="d-flex justify-content-between mb-3">
    <p>Found <strong>{{ products.total }}</strong> products</p>
    <select name="sorting" class="form-select w-auto"
        data-request="onAjax"
        data-request-update="{ _self: true }">
        {% for key, label in sortingOptions %}
            <option value="{{ key }}" {{ sortingPreference == key ? 'selected' }}>{{ label }}</option>
        {% endfor %}
    </select>
</div>

<div class="row g-4 row-cols-lg-3 row-cols-md-2 row-cols-1">
    {% for product in products %}
        <div class="col">
            {% partial 'shop/product-card' product=product %}
        </div>
    {% endfor %}
</div>

{{ ajaxPager(products) }}
```

::: tip
The `data-request-update="{ _self: true }"` pattern tells the AJAX framework to re-render the current partial and replace its contents in the DOM. This is a convenient way to refresh a partial's content without specifying an explicit DOM selector.
:::

### Product Card

A reusable product card for grid and list views:

```twig
{# partials/shop/product-card.htm #}
<div class="card card-product h-100">
    <div class="card-body">
        <div class="text-center position-relative">
            {% if product.on_sale %}
                <span class="badge bg-danger position-absolute top-0 start-0">On Sale!</span>
            {% endif %}
            <a href="{{ product.pageUrl('shop/product') }}">
                {% if product.images is not empty %}
                    <img class="img-fluid mb-3"
                        src="{{ product.images.first|resize(0, 160, { mode: 'auto' }) }}"
                        alt="{{ product.name }}" />
                {% endif %}
            </a>
        </div>
        <div class="text-small text-muted mb-1">
            {{ product.categories.first.name }}
        </div>
        <h2 class="fs-6">
            <a href="{{ product.pageUrl('shop/product') }}" class="text-inherit text-decoration-none">
                {{ product.name }}
            </a>
        </h2>
        <div class="d-flex justify-content-between align-items-center mt-3">
            <div>
                <span>{{ product.final_sale_price|currency }}</span>
                {% if product.on_sale %}
                    <span class="text-decoration-line-through text-muted">
                        {{ product.final_price|currency }}
                    </span>
                {% endif %}
            </div>
            <button
                data-request="onAddToCart"
                data-request-data="{ product_baseid: '{{ product.baseid }}' }"
                data-request-update="{ 'shop/mini-cart': '#miniCart' }"
                data-request-flash
                class="btn btn-primary btn-sm">
                Add to Cart
            </button>
        </div>
    </div>
</div>
```

### Breadcrumb Navigation

```twig
{# partials/shop/breadcrumb.htm #}
<nav aria-label="breadcrumb">
    <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item"><a href="{{ 'shop/index'|page }}">Home</a></li>
        {% for category in object.breadcrumbPath %}
            <li class="breadcrumb-item">
                <a href="{{ category.pageUrl('shop/category') }}">{{ category.name }}</a>
            </li>
        {% endfor %}
        <li class="breadcrumb-item active" aria-current="page">{{ object.name }}</li>
    </ol>
</nav>
```

The `object` parameter can be either a Product or a Category — both provide a `breadcrumbPath` property.

### Shop Homepage with Custom Groups

```twig
{# pages/shop/index.htm #}
##
url = "/shop"

[cart]
[catalog]
==
<div class="container">
    <h2>Browse Categories</h2>
    {% set categories = catalog.allCategories %}
    {% for category in categories %}
        <a href="{{ category.pageUrl('shop/category') }}">{{ category.name }}</a>
    {% endfor %}

    <h2>Featured Products</h2>
    {% set featured = catalog.findCustomGroup('featured-products') %}
    {% if featured %}
        <div class="row">
            {% for product in featured.products %}
                <div class="col-md-3">
                    {% partial 'shop/product-card' product=product %}
                </div>
            {% endfor %}
        </div>
    {% endif %}
</div>
```

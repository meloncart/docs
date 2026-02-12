---
subtitle: Category, Manufacturer, and CustomGroup model reference.
---
# Catalog Models

This reference documents all Twig-accessible properties and methods for catalog organization models: categories, manufacturers, and custom groups. These models are typically accessed via the [Catalog component](../components/catalog).

## Category

Categories organize products into a browsable hierarchy with unlimited nesting depth. The category tree powers navigation menus, product listing pages, and breadcrumb trails.

### Core Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Primary key |
| `name` | `string` | Category name |
| `slug` | `string` | URL slug for this category |
| `fullslug` | `string` | Full URL path including parents (e.g., `electronics/phones`) |
| `baseid` | `string` | Base identifier |
| `code` | `string` | Category code for programmatic reference |
| `title` | `string` | SEO/page title (falls back to `name`) |
| `description` | `string` | Full description (HTML) |
| `short_description` | `string` | Brief summary |
| `is_hidden` | `bool` | Whether hidden from frontend |
| `sort_order` | `int` | Display order |
| `parent_id` | `int\|null` | Parent category ID |
| `created_at` | `Carbon` | Creation date |
| `updated_at` | `Carbon` | Last update date |

### Relationships

| Property | Type | Description |
|----------|------|-------------|
| `products` | `Collection<Product>` | Products in this category |
| `parent` | `Category\|null` | Parent category |
| `children` | `Collection<Category>` | Direct child categories |
| `images` | `Collection<File>` | Category images |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `pageUrl($pageName)` | `string` | CMS page URL for this category |
| `countProducts()` | `int` | Number of products in this category |
| `listProducts($options)` | `Paginator` | Paginated product listing |
| `getBreadcrumbPath()` | `array\|null` | Parent chain for breadcrumbs |
| `getParents()` | `array` | All ancestor categories |

### Scopes

| Scope | Description |
|-------|-------------|
| `applyVisible` | Filters out hidden categories |

### listProducts Options

The `listProducts()` method returns a paginated collection with these options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `page` | `int` | `1` | Page number |
| `perPage` | `int` | `30` | Products per page |
| `sorting` | `string` | `created_at` | Sort field: `created_at`, `price`, `name`, `random` |
| `search` | `string` | `''` | Search term |

Sorting supports direction: `'price desc'`, `'name asc'`.

### Complete Examples

#### Category Navigation

```twig
{# Multi-level category menu #}
{% set categories = catalog.allCategories() %}
<nav>
    <ul>
        {% for category in categories %}
            <li>
                <a href="{{ category.pageUrl('shop/category') }}">
                    {{ category.name }}
                    <span class="count">({{ category.countProducts() }})</span>
                </a>
                {% if category.children is not empty %}
                    <ul>
                        {% for child in category.children %}
                            <li>
                                <a href="{{ child.pageUrl('shop/category') }}">
                                    {{ child.name }}
                                </a>
                            </li>
                        {% endfor %}
                    </ul>
                {% endif %}
            </li>
        {% endfor %}
    </ul>
</nav>
```

#### Category Page with Product Listing

```twig
<h1>{{ category.name }}</h1>

{% if category.description %}
    <div class="category-description">
        {{ category.description|raw }}
    </div>
{% endif %}

{# Subcategories #}
{% if category.children is not empty %}
    <div class="subcategories">
        {% for child in category.children %}
            <a href="{{ child.pageUrl('shop/category') }}">
                {% set image = child.images.first() %}
                {% if image %}
                    <img src="{{ image.path|resize(200, 200) }}" alt="{{ child.name }}" />
                {% endif %}
                <span>{{ child.name }}</span>
            </a>
        {% endfor %}
    </div>
{% endif %}

{# Products with sorting #}
{% set products = category.listProducts({
    page: pagination,
    perPage: 12,
    sorting: 'price asc'
}) %}

<div class="product-grid">
    {% for product in products %}
        {% partial 'shop/product-card' product=product %}
    {% endfor %}
</div>

{# Pagination #}
{{ products.render()|raw }}
```

#### Breadcrumbs

```twig
{% set breadcrumbs = category.getBreadcrumbPath() %}
{% if breadcrumbs %}
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li><a href="{{ 'shop'|page }}">Shop</a></li>
            {% for crumb in breadcrumbs %}
                <li>
                    <a href="{{ crumb.pageUrl('shop/category') }}">
                        {{ crumb.name }}
                    </a>
                </li>
            {% endfor %}
            <li class="active">{{ category.name }}</li>
        </ol>
    </nav>
{% endif %}
```

---

## Manufacturer

Manufacturers represent brands or companies that produce products. Each product can belong to one manufacturer.

### Core Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Primary key |
| `name` | `string` | Manufacturer name |
| `slug` | `string` | URL slug |
| `baseid` | `string` | Base identifier |
| `description` | `string` | Description (HTML) |
| `is_hidden` | `bool` | Whether hidden from frontend |
| `created_at` | `Carbon` | Creation date |
| `updated_at` | `Carbon` | Last update date |

### Contact Properties

| Property | Type | Description |
|----------|------|-------------|
| `address_line1` | `string` | Street address |
| `city` | `string` | City |
| `zip` | `string` | Postal/ZIP code |
| `email` | `string` | Contact email |
| `website_url` | `string` | Website URL |
| `phone` | `string` | Phone number |
| `fax` | `string` | Fax number |

### Relationships

| Property | Type | Description |
|----------|------|-------------|
| `products` | `Collection<Product>` | Products by this manufacturer |
| `logo` | `File\|null` | Manufacturer logo image |
| `country` | `Country\|null` | Country (via RainLab.Location) |
| `state` | `State\|null` | State/province (via RainLab.Location) |

### Accessing Manufacturers

The catalog component supports manufacturer lookup:

```ini
[catalog]
lookup = "manufacturer"
identifier = "slug"
```

This sets the `manufacturer` page variable, giving you access to all manufacturer properties and its products.

### Complete Examples

#### Manufacturer Page

```twig
title = "Manufacturer"
url = "/shop/manufacturer/:slug"

[catalog]
lookup = "manufacturer"
identifier = "slug"
==
{% if not manufacturer %}
    {% do abort(404) %}
{% endif %}

<div class="manufacturer-detail">
    {% if manufacturer.logo %}
        <img src="{{ manufacturer.logo.path|resize(300, 200) }}"
             alt="{{ manufacturer.name }}" />
    {% endif %}

    <h1>{{ manufacturer.name }}</h1>

    {% if manufacturer.description %}
        <div>{{ manufacturer.description|raw }}</div>
    {% endif %}

    {% if manufacturer.website_url %}
        <a href="{{ manufacturer.website_url }}" target="_blank">
            Visit Website
        </a>
    {% endif %}

    <h2>Products by {{ manufacturer.name }}</h2>
    <div class="product-grid">
        {% for product in manufacturer.products %}
            {% partial 'shop/product-card' product=product %}
        {% endfor %}
    </div>
</div>
```

#### Manufacturer Info on Product Page

```twig
{% if product.manufacturer %}
    <div class="manufacturer-info">
        {% if product.manufacturer.logo %}
            <img src="{{ product.manufacturer.logo.path|resize(100, 60) }}"
                 alt="{{ product.manufacturer.name }}" />
        {% endif %}
        <a href="{{ 'shop/manufacturer'|page({ slug: product.manufacturer.slug }) }}">
            {{ product.manufacturer.name }}
        </a>
    </div>
{% endif %}
```

#### Manufacturer List

```twig
[catalog]
==
{% set manufacturers = catalog.customGroupQuery() %}
{# Or query directly: #}

<h1>Our Brands</h1>
<div class="brand-grid">
    {% for manufacturer in manufacturers %}
        <a href="{{ 'shop/manufacturer'|page({ slug: manufacturer.slug }) }}">
            {% if manufacturer.logo %}
                <img src="{{ manufacturer.logo.path|resize(200, 120) }}"
                     alt="{{ manufacturer.name }}" />
            {% endif %}
            <span>{{ manufacturer.name }}</span>
        </a>
    {% endfor %}
</div>
```

---

## CustomGroup

Custom groups are curated, flat collections of products used for specific sections of your site — featured products, new arrivals, best sellers, etc. Products within a group can be manually sorted.

### Core Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Primary key |
| `name` | `string` | Group name |
| `code` | `string` | Unique code for template lookup |
| `created_at` | `Carbon` | Creation date |
| `updated_at` | `Carbon` | Last update date |

### Relationships

| Property | Type | Description |
|----------|------|-------------|
| `products` | `Collection<Product>` | Products in this group (sorted by `sort_order`) |

### Accessing Custom Groups

Use the catalog component's `findCustomGroup()` method to look up a group by its code:

```twig
{% set group = catalog.findCustomGroup('featured-products') %}
```

Or use `customGroupQuery()` to query all groups:

```twig
{% set groups = catalog.customGroupQuery().get() %}
```

### Complete Examples

#### Featured Products Section

```twig
{% set featured = catalog.findCustomGroup('featured-products') %}
{% if featured and featured.products is not empty %}
    <section class="featured-products">
        <h2>Featured Products</h2>
        <div class="product-grid">
            {% for product in featured.products %}
                {% partial 'shop/product-card' product=product %}
            {% endfor %}
        </div>
    </section>
{% endif %}
```

#### Multiple Groups on Homepage

```twig
{% set featured = catalog.findCustomGroup('featured') %}
{% set newArrivals = catalog.findCustomGroup('new-arrivals') %}
{% set bestSellers = catalog.findCustomGroup('best-sellers') %}

{% for group in [featured, newArrivals, bestSellers] %}
    {% if group and group.products is not empty %}
        <section>
            <h2>{{ group.name }}</h2>
            <div class="product-grid">
                {% for product in group.products %}
                    {% partial 'shop/product-card' product=product %}
                {% endfor %}
            </div>
        </section>
    {% endif %}
{% endfor %}
```

#### Commerce Theme Custom Group Partial

The commerce theme includes a reusable `shop/custom-group` partial:

```twig
{% partial 'shop/custom-group' groupCode='featured-products' %}
```

This partial looks up the group by code and renders a product grid. If the group doesn't exist, it displays a message prompting you to create it in the backend.

---

## Querying Products

Both categories and custom groups give you access to product collections, but for more advanced queries, use the catalog component's query builders.

### Product Query Builder

```twig
{# Custom product query #}
{% set products = catalog.productQuery()
    .applyVisible()
    .where('is_on_sale', true)
    .orderBy('price', 'asc')
    .limit(8)
    .get() %}

{% for product in products %}
    {% partial 'shop/product-card' product=product %}
{% endfor %}
```

### Category Query Builder

```twig
{# All top-level categories #}
{% set topLevel = catalog.categoryQuery()
    .applyVisible()
    .whereNull('parent_id')
    .orderBy('sort_order')
    .get() %}
```

### Custom Group Query Builder

```twig
{# All custom groups #}
{% set groups = catalog.customGroupQuery().get() %}
{% for group in groups %}
    <h3>{{ group.name }} ({{ group.products.count() }} products)</h3>
{% endfor %}
```

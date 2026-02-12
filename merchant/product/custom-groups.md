---
subtitle: Create custom product groups for featured sections and promotions.
---
# Custom Groups

Custom groups let you create curated collections of products for use on the storefront. Unlike categories, which provide a browsable hierarchy, custom groups are flat, code-referenced collections designed for specific sections of your site — such as a "Featured Products" slider on the homepage, a "New Arrivals" section, or a "Best Sellers" list.

Custom groups are accessed from the Products page toolbar. Click the **Product Groups** button (copy icon) on the Products list page to open the groups list.

## Creating a Custom Group

Click **New Group** to create a custom group. The following fields are available:

- **Group Name** — A descriptive name for the group (e.g., "Featured Products", "Staff Picks", "Holiday Gift Guide").
- **API Code** — A unique code used to reference this group in your theme templates. Automatically generated from the name, but can be customized. For example, a group with the code `featured-products` can be retrieved in Twig using `catalog.findCustomGroup('featured-products')`.

## Managing Products in a Group

Navigate to the **Products** tab on the group form to add and manage products. Use the **Add** button to associate products with the group, or **Remove** to disassociate them.

Products within a group can be reordered by dragging them into the desired display position. This sort order is preserved and used on the storefront when displaying the group's products.

## Groups vs Categories

Custom groups and categories serve different purposes:

| Feature | Categories | Custom Groups |
|---------|-----------|---------------|
| **Structure** | Hierarchical tree | Flat list |
| **Purpose** | Browsable navigation | Curated sections |
| **Product assignment** | Multiple categories | Multiple groups |
| **Sortable products** | No (uses default sort) | Yes (drag-and-drop) |
| **URL routing** | Has dedicated pages | Referenced by code in templates |
| **Typical use** | Site navigation, filtering | Homepage features, promotions |

A product can belong to both categories and custom groups simultaneously.

## Using Groups on the Storefront

Custom groups are designed to be referenced by their API code in theme templates. The commerce theme includes a `shop/custom-group` partial that displays a product grid for any group code:

```twig
{% partial 'shop/custom-group' groupCode='featured-products' %}
```

If the group code is not found, a helpful message is displayed prompting you to create the group in the backend.

See the [Catalog component](../../developer/components/catalog) documentation for the developer API used to query custom groups.

::: tip
Custom groups are ideal for content that changes frequently. Rather than modifying theme templates to feature different products, simply update the products in the group through the backend.
:::

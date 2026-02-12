---
subtitle: Create and manage your product catalog.
---
# Products

Products are the core of your store. Each product represents an item you sell, complete with pricing, images, descriptions, and configurable attributes. Navigate to **Shop → Products** to manage your product catalog.

## Creating a Product

Click **New Product** to create a product. The following fields are required:

- **Name** — The display name shown to customers.
- **SKU** — A unique stock keeping unit code used for internal tracking and order fulfillment.
- **Price** — The base selling price of the product.
- **Tax Class** — The tax class used to calculate tax on this product.
- **Categories** — At least one category must be assigned.

Additional fields on the product form include:

- **Cost** — The wholesale or cost price, used for margin reporting. Not displayed to customers.
- **Description** — A detailed product description shown on the product detail page.
- **Short Description** — A brief summary used in product listings and search results.
- **URL Slug** — Automatically generated from the product name, used in the product's frontend URL.

## Product Types

Every product is assigned a **Product Type** that controls which features are available for that product. Product types are managed under **Shop → Product Types** and define the following capabilities:

| Feature | Description |
|---------|-------------|
| **Has Shipping** | Product requires physical shipping |
| **Has Inventory** | Stock tracking is available for this product |
| **Has Files** | Downloadable files can be attached (for digital products) |
| **Has Options** | Configurable options like size or color |
| **Has Extras** | Paid add-ons can be offered |
| **Has Bundles** | Product can include bundled items |
| **Has Variants** | Variant combinations can be generated from options |

A default product type is created during installation. You can create additional types to suit different product categories — for example, a "Digital Download" type with files enabled but shipping and inventory disabled.

::: tip
Product types are a powerful way to simplify the product form. When a feature is disabled on the product type, its related fields and tabs are hidden from the product form entirely.
:::

## Product Images and Files

### Images

Use the **Images** section to upload product photos. Multiple images can be uploaded and reordered. The first image typically serves as the primary product image on listing pages, while all images are shown in a gallery on the product detail page.

### Downloadable Files

If the product type has the **Has Files** feature enabled, a **Files** section appears where you can upload downloadable files. These are delivered to customers after purchase — useful for digital products like software, e-books, or media.

## Categories

Products are assigned to one or more categories using the **Categories** relation on the product form. A product must belong to at least one category.

The first category assigned to a product is considered its **primary category** and is used for breadcrumb navigation. A product assigned to multiple categories will appear in all of them on the storefront.

## Manufacturers

Optionally assign a **Manufacturer** (or brand) to a product. Manufacturers are managed under **Shop → Manufacturers** and include fields for company details, logo, and contact information. On the frontend, your theme can provide manufacturer-specific listing pages.

## Product Options

Options let customers choose between variations of a product, such as size, color, or material. They appear as dropdown menus or selection controls on the product detail page.

To add options, open the **Options** tab on the product form and click **Add New Option**. Each option has:

- **Name** — The option label shown to customers (e.g., "Size", "Color").
- **Values** — A list of available choices, entered one per line (e.g., "Small", "Medium", "Large").

Options can be reordered by dragging them into the desired display order.

::: info
Options define what choices are available to the customer. If you need each combination of options to have its own price, SKU, or stock level, see the [Variants](./variants) documentation.
:::

### Option Sets

If you frequently use the same set of options across multiple products, you can save them as an **Option Set** for reuse. When editing a product's options, use the **Load Set** button to populate the options from a saved set. You can also **Save Set** to create a reusable template from the current product's options.

## Product Extras

Extras are optional paid add-ons that customers can select when purchasing a product. Unlike options, extras have their own price and weight — for example, gift wrapping, extended warranty, or engraving.

To add extras, open the **Extras** tab and click **Add New Extra**. Each extra has:

- **Group Name** — An optional label to group related extras together (e.g., "Gift Options").
- **Description** — The name or description shown to the customer (e.g., "Gift Wrapping").
- **Price** — The additional cost added when the extra is selected.
- **Weight** — Optional additional weight for shipping calculations.
- **Images** — Optional images for the extra.

### Extra Sets

Similar to option sets, you can create **Extra Sets** to reuse the same extras across multiple products. Extra sets are managed under **Shop → Extra Sets** and can be attached to products via the **Extra Sets** relation. When an extra set is attached to a product, all extras defined in that set become available on the product detail page alongside any product-specific extras.

## Product Properties

Properties are informational specifications displayed on the product detail page — for example, "Material: Cotton" or "Capacity: 500ml". Unlike options, properties are not selectable by the customer; they are descriptive attributes.

To add properties, open the **Properties** tab and click **Add New Property**. Each property has:

- **Name** — The specification label (e.g., "Material", "Dimensions").
- **Value** — The specification value (e.g., "Stainless Steel", "10 x 5 x 3 cm"). Previously used values for the same property name are suggested for consistency.

### Property Sets

**Property Sets** let you create reusable property templates. When you load a property set into a product, it pre-fills the property names so you only need to enter the values. This helps ensure consistent specification names across similar products.

## Related Products

The **Related Products** relation lets you link products together. Related products are displayed on the product detail page as suggestions, helping customers discover similar or complementary items. Relationships are one-directional — if Product A lists Product B as related, Product B does not automatically list Product A.

## Bundle Items

If the product type has the **Has Bundles** feature enabled, you can create bundle items that group other products together. Each bundle item defines a selection group with a control type (dropdown, radio, or checkbox), a name, and a list of products the customer can choose from. Bundles allow you to sell product kits or configurable packages.

## Pricing

### Base Price

The **Price** field is the standard selling price displayed to customers. The **Cost** field is your internal cost for the product and is not shown on the storefront.

### Sale Prices

To put a product on sale, check the **On Sale** checkbox and enter a value in the **Sale Price or Discount** field. This field supports three formats:

| Format | Example | Effect |
|--------|---------|--------|
| Fixed price | `5000` | Sets the sale price to $50.00 |
| Percentage off | `20%` | Reduces the price by 20% |
| Fixed amount off | `-2000` | Reduces the price by $20.00 |

::: tip
The sale price only affects the displayed price on the storefront. The original price is shown alongside the sale price so customers can see the savings.
:::

### Price Tiers

Price tiers allow you to offer volume-based discounts. When the **Allow Price Tiers** checkbox is enabled, you can define quantity thresholds with reduced prices.

Each tier has:

- **Quantity** — The minimum quantity required to qualify for this price.
- **Price** — The per-unit price at this quantity.
- **User Group** — Optionally restrict this tier to a specific customer group.

For example, you might set a price of $10 for quantities of 1–9, $8 for 10–49, and $6 for 50 or more. The best matching tier for the customer's quantity is automatically applied.

### Tax Classes

Every product must be assigned a **Tax Class**. Tax classes determine how tax is calculated for the product based on the customer's location. Tax classes are managed through the Responsiv.Pay plugin under **Settings → Tax**.

## Visibility Controls

Several settings control where and how a product appears:

- **Enabled** — When unchecked, the product is completely hidden from the frontend. Disabled products do not appear in any listings or search results.
- **Visible in Search** — Controls whether the product appears in search results.
- **Visible in Catalog** — Controls whether the product appears in category listings and browsing pages.

A product can be enabled but hidden from search or catalog listings. This is useful for products that should only be accessible via a direct link.

### User Group Visibility

You can restrict product visibility to specific customer groups. When user group visibility is enabled, only customers belonging to the selected groups can see the product on the storefront. This is useful for wholesale-only products, member-exclusive items, or products restricted to certain customer segments.

## Custom Groups

Custom groups are user-defined collections of products used to create curated product sets on the storefront — for example, "Featured Products", "New Arrivals", or "Best Sellers". Custom groups are managed under **Shop → Groups**.

To assign a product to a custom group, use the **Custom Groups** relation on the product form. Products within a custom group can be reordered to control their display sequence.

Your theme developer can then query these groups to display them in specific areas of the storefront, such as homepage sliders or promotional sections.

## Import and Export

The product list supports bulk operations through CSV import and export. Use the **Import** and **Export** buttons on the product list toolbar to:

- **Export** — Download your entire product catalog or a filtered selection as a CSV file.
- **Import** — Upload a CSV file to create or update products in bulk.

This is useful for migrating products from another platform, performing bulk price updates, or syncing with external inventory systems.

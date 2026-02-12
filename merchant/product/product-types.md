---
subtitle: Configure product types to control which features are available for each product.
---
# Product Types

Product types define which features and tabs are available when editing a product. Different kinds of products need different capabilities — a physical product needs shipping and inventory, a digital product needs file uploads, and a service needs neither. Product types let you tailor the product form to match each use case.

Product types are accessed from the Products page toolbar. Click the **Product Types** button on the Products list page to open the types list.

## Default Product Types

Meloncart ships with three product types out of the box:

### Goods (Default)

For physical products that are shipped to customers and tracked in inventory.

- Inventory tracking: enabled
- Shipping: enabled
- Options: enabled (for size, color, etc.)
- Extras: enabled (for add-ons like gift wrap)
- Files, bundles, variants: disabled

### Service

For non-physical services like consulting, appointments, or subscriptions.

- All shipping and inventory features: disabled
- Options: enabled (for service tiers or configurations)
- Extras: enabled (for add-on services)
- Files, bundles, variants: disabled

### Downloadable

For digital products delivered as file downloads.

- Files: enabled (for uploading downloadable content)
- Options: enabled
- Extras: enabled
- Shipping, inventory, bundles, variants: disabled

## Creating a Product Type

Click **New Product Type** to create a custom product type. The following fields are available:

- **Type Name** — A descriptive name for the product type (e.g., "Physical with Variants", "Bundle Product", "Digital Service").
- **API Code** — A code identifier for referencing this type programmatically. Automatically generated from the name.
- **Default** — When checked, this type is automatically selected for new products. Only one type can be the default.

### Feature Flags

Each flag controls the visibility of a corresponding tab on the product edit form:

| Flag | Tab | Purpose |
|------|-----|---------|
| **Enable Files** | Files | Upload downloadable files for digital products |
| **Enable Shipping** | Shipping | Set weight and dimensions for shipping calculations |
| **Enable Inventory** | Inventory | Track stock levels, set low-stock thresholds, allow pre-orders |
| **Enable Options** | Options | Define selectable attributes like Size or Color |
| **Enable Extras** | Extras | Offer paid add-ons like gift wrapping or extended warranty |
| **Enable Bundles** | Bundles | Create composite products from multiple product choices |
| **Enable Variants** | Variants | Generate SKU/price/stock combinations from options |

When a flag is disabled, the corresponding tab is hidden from the product form. This keeps the interface clean and focused on relevant features.

## How Product Types Affect the Store

### Shipping

If any item in the cart has a product type with **Enable Shipping** checked, the checkout will require a shipping address and method. Products without shipping enabled (like digital goods or services) skip the shipping step when they are the only items in the cart.

### Inventory

Products with **Enable Inventory** checked can track stock levels, display out-of-stock states, and trigger low-stock notifications. Products without this flag have unlimited availability.

### Files and Downloads

Products with **Enable Files** checked show a file upload area where you can attach downloadable files. After purchase, these files can be made available to the customer through download links. See [Digital Downloads](../order/downloads) for details.

### Variants

When **Enable Variants** is checked, the product can generate variant combinations from its options. Each variant can have its own SKU, price, weight, and stock level. See [Variants](./variants) for details.

### Bundles

When **Enable Bundles** is checked, the product can define bundle slots with product choices. See [Bundles](./bundles) for details.

## Changing a Product's Type

To change a product's type, open the product and select a different type from the **Product Type** dropdown on the Product tab. The form tabs will immediately update to reflect the new type's feature flags.

::: warning
Changing a product's type does not delete any existing data. For example, switching from a type with inventory enabled to one without it will hide the Inventory tab, but the stock values are preserved in the database. If you switch back, the previous values will still be there.
:::

## Example Configurations

Here are some common product type configurations:

| Use Case | Files | Shipping | Inventory | Options | Extras | Bundles | Variants |
|----------|-------|----------|-----------|---------|--------|---------|----------|
| Physical product | — | Yes | Yes | Yes | Yes | — | — |
| Physical with variants | — | Yes | Yes | Yes | Yes | — | Yes |
| Digital download | Yes | — | — | Yes | Yes | — | — |
| Service / subscription | — | — | — | Yes | Yes | — | — |
| Bundle / kit | — | Yes | — | — | — | Yes | — |
| Gift card | — | — | — | — | — | — | — |

::: tip
Create product types that match your specific business needs. The default types are a starting point — you can modify them or create new ones at any time.
:::

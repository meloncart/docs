---
subtitle: Configure product options and variations.
---
# Variants

Variants represent specific combinations of product options. If a product comes in multiple sizes and colors, each size-color pair (e.g., "Large / Red") is a variant. Each variant can have its own price, SKU, weight, dimensions, and stock level, allowing you to manage each combination independently.

## When to Use Variants

Use variants when you need per-combination control over pricing or inventory. For example:

- A t-shirt in sizes S, M, L and colors Red, Blue — where "Large / Red" has a different price than "Small / Blue".
- A laptop with storage options 256GB and 512GB — where each option has a different SKU and stock count.
- A ring in sizes 5–10 — where each size has a unique barcode.

If all combinations share the same price, SKU, and stock level, you may only need [product options](./products#product-options) without variants.

## Enabling Variants

Variants are available when the product type has the **Has Variants** feature enabled. On the product form, check the **Use Variants** checkbox to activate variant management for that product.

Once enabled, a **Variants** tab appears on the product form where you can generate and manage individual variants.

::: warning
Before generating variants, make sure you have defined your product options (e.g., Size and Color with their values) on the **Options** tab. Variants are created from the combinations of these option values.
:::

## Generating Variants

Click the **Generate Variants** button to automatically create a variant for every possible combination of your product options. This produces the full Cartesian product of all option values.

For example, if your product has:
- **Size**: Small, Medium, Large
- **Color**: Red, Blue

Generating variants creates six variants: Small/Red, Small/Blue, Medium/Red, Medium/Blue, Large/Red, Large/Blue.

Only new combinations are created — if some variants already exist, they are left unchanged. This means you can safely regenerate after adding new option values without losing existing variant data.

## Managing Variants

Each variant appears as a row in the variants list. Click a variant to edit its attributes:

- **SKU** — A unique SKU for this specific variant. If left empty, the product's base SKU is used.
- **Price** — A variant-specific price. If left empty, the product's base price is used.
- **Cost** — The cost price for this variant.
- **Compare Price** — An optional comparison price displayed alongside the variant price.
- **Weight** — The shipping weight for this variant. Falls back to the product's weight if empty.
- **Dimensions** (Width, Height, Depth) — Physical dimensions for this variant. Falls back to the product's dimensions if empty.
- **Barcode** — An optional barcode (UPC, EAN, etc.) for this variant.
- **Units in Stock** — The stock level for this variant. See [Inventory](./inventory) for details.
- **Stock Alert Threshold** — The stock level at which a low-stock alert is triggered.
- **Enabled** — Whether this variant is available for purchase. Disabled variants cannot be added to the cart.

::: tip
You only need to fill in fields that differ from the product's base values. Any field left empty on the variant will automatically use the corresponding value from the parent product.
:::

## Variant Pricing

Variants support their own pricing structure, independent of the parent product.

### Base Variant Price

Set the **Price** field on a variant to give it a specific price. When a customer selects this variant's option combination, this price is used instead of the product's base price.

### Variant Price Tiers

Each variant can have its own tier pricing rules for volume-based discounts. Variant price tiers work the same way as product-level price tiers — you define quantity thresholds with corresponding prices, optionally restricted to specific user groups.

### How Pricing is Resolved

When a customer adds a product to the cart with a specific option combination, the system resolves the variant and determines the final price using this priority:

1. **Variant-specific tier price** — If the variant has tier pricing and the quantity qualifies, the tier price is used.
2. **Variant base price** — If the variant has a price set, that price is used.
3. **Product base price** — If the variant has no price, the product's base price is used.

Catalog price rules (set up under **Shop → Price Rules**) are also factored in. If a catalog rule produces a lower price than the resolved variant price, the rule price is used instead.

## Variant Stock

Each variant can track its own inventory independently. Set the **Units in Stock** field on a variant to manage its stock level separately from the product.

If a variant's stock field is left empty, stock tracking falls back to the product level. This lets you choose between product-level and variant-level inventory tracking on a per-variant basis.

For more details on inventory management, see the [Inventory](./inventory) documentation.

## How Variant Resolution Works

When a customer selects options on the product page and adds the product to the cart, the system identifies the correct variant by computing a hash from the selected option combination. This lookup is instant regardless of how many variants exist.

If no variant matches the selected combination, or if the matching variant is disabled, the customer receives an error message and the item is not added to the cart.

## Default Variant

One variant can be marked as the **Default**. The default variant's values are used when the product is first loaded on the storefront, before the customer makes any option selections.

---
subtitle: Create configurable product bundles from multiple products.
---
# Bundles

Bundles let you create composite products where the customer selects from predefined choices for each slot. For example, a custom PC bundle might have slots for Processor, Memory, and Storage, each offering several product choices. The customer builds their own configuration by picking one product per slot.

Bundles are different from product options. Options are simple attributes like Size or Color that belong to a single product, while bundles combine multiple independent products into a single purchasable package.

## Enabling Bundles

Bundles are controlled by the product type. Only products with a product type that has the **Enable Bundles** flag checked will show the Bundles tab. See [Product Types](./product-types) for details on configuring product type flags.

## Creating Bundle Slots

Open a product with bundles enabled and navigate to the **Bundles** tab. Click **Add Bundle Slot** to create a new slot. Each slot represents a category of choice within the bundle.

- **Name** — A descriptive name for the slot, such as "Processor" or "Memory". This is shown to the customer on the storefront.
- **Control Type** — How the customer selects a product for this slot:
  - **Dropdown** — A select menu showing all available products.
  - **Radio** — Radio buttons, useful when you want all options visible at once.
  - **Checkbox** — Checkboxes, allowing the customer to select multiple products for this slot.
- **Required** — When checked, the customer must select a product for this slot before adding the bundle to the cart.
- **Description** — An optional description to help the customer understand what this slot is for.

You can reorder slots by dragging them into the desired position.

## Adding Product Choices

Within each bundle slot, click **Add Product Choice** to add products that the customer can choose from. Each product choice has the following settings:

- **Product** — The product to offer as a choice in this slot.
- **Price Mode** — How the price is calculated for this choice:
  - **Default Product Price** — Uses the product's normal price.
  - **Fixed Price** — Overrides the price with a specific amount.
  - **Fixed Discount** — Subtracts a fixed amount from the product's normal price.
  - **Percentage Discount** — Subtracts a percentage from the product's normal price.
- **Price / Discount Amount** — The amount used for the selected price mode. Only shown when the price mode is not Default.
- **Default Quantity** — The quantity to use when this product is selected. Defaults to 1.
- **Default Selection** — When checked, this product is pre-selected when the bundle is first shown to the customer.
- **Active** — When unchecked, this product choice is hidden from the customer. Useful for temporarily removing a choice without deleting it.
- **Allow Manual Quantity** — When checked, the customer can change the quantity for this product.

You can reorder product choices by dragging them within the slot.

## How Bundles Work in the Cart

When a customer adds a bundle to the cart, each selected product choice becomes a separate line item linked to the master bundle product. The cart displays the master product with its child items grouped beneath it, each showing the slot name as a prefix (e.g., "[Processor] Intel Core i7").

The total price of the bundle is the sum of the master product's price plus all selected child product prices (calculated according to their price modes).

## How Bundles Appear in Orders

When an order is placed, bundle child items are stored as separate order items linked to the master item. Each child item records the bundle slot name for display purposes. The order detail view shows bundle children with their slot name prefix, making it clear which products belong to which bundle.

::: tip
Bundle products work best with a dedicated product type. Create a product type with only the **Enable Bundles** flag checked (and optionally **Enable Shipping** for physical bundles) to keep the product form focused on bundle configuration.
:::

---
subtitle: Configure tax classes and understand how taxes are calculated.
---
# Taxes

Tax calculation in Meloncart is handled by the **Responsiv.Pay** plugin. Taxes are configured through tax classes, which define rates based on the customer's location. Meloncart uses these tax classes to calculate taxes on both products and shipping.

## Tax Classes

Tax classes are the foundation of tax configuration. Each tax class defines a set of tax rates that apply to different locations. Navigate to **Settings → Tax** (provided by the Responsiv.Pay plugin) to manage tax classes.

Every product must be assigned a tax class. The tax class determines how tax is calculated when that product is purchased, based on where the customer is located.

### Creating a Tax Class

Click **New Tax Class** to create one. A tax class consists of:

- **Name** — A descriptive name for the class (e.g., "Standard Rate", "Reduced Rate", "Zero Rate").
- **Tax Rates** — One or more rates, each associated with a specific country and optionally a state. Each rate defines a percentage that is applied when the customer's address matches the location.

For example, a "Standard Rate" tax class might have:
- 20% for United Kingdom
- 19% for Germany
- 7% for Switzerland
- 0% for United States (if no tax applies)

When a customer from Germany purchases a product assigned to this tax class, the 19% rate is applied.

### Assigning Tax Classes to Products

Every product requires a tax class assignment. Set the **Tax Class** field on the product form to associate the product with a specific set of tax rates.

If your store sells a mix of products with different tax treatments (for example, standard-rated goods and zero-rated food items), create separate tax classes for each and assign them appropriately.

## How Taxes Are Calculated

### Location-Based Calculation

Tax rates are resolved based on the customer's shipping address. The system matches the customer's country and state against the tax rates defined in each product's tax class to determine the applicable rate.

When a customer has not yet entered an address (for example, when browsing the catalog), the store's default location is used for tax calculation. This default is configured under **Settings → eCommerce Settings**.

### Tax Display Modes

Meloncart supports two tax display modes, configured under **Settings → eCommerce Settings**:

- **Prices include tax** — Product prices entered in the backend include tax. The system calculates the tax component from the inclusive price. This is common in regions where consumer-facing prices must include tax (e.g., most of Europe, Australia).
- **Prices exclude tax** — Product prices entered in the backend do not include tax. Tax is calculated and added on top of the product price. This is common in regions where tax is added at the point of sale (e.g., United States, Canada).

The **Display Prices with Tax** setting controls whether prices shown on the storefront include the tax component. This can differ from how prices are entered. For example, you might enter prices excluding tax but display them including tax on the storefront.

::: tip
When prices include tax is enabled, you must also set a default country in the eCommerce settings. This default country determines the base tax rate used to back-calculate the tax-exclusive price when selling to customers in different locations.
:::

### Tax on Orders

When an order is placed, the system calculates taxes for each line item based on:

1. The product's tax class
2. The customer's shipping address
3. Whether prices include tax

The calculated taxes are stored on the order as a JSON breakdown, showing each tax name and its amount. This breakdown appears on the order detail page and is included in invoices.

### Tax on Shipping

If a shipping method is marked as taxable (the **Taxable** checkbox on the shipping method), shipping costs are also subject to tax. Shipping tax is calculated using the same location-based logic and is shown as a separate line in the order's tax breakdown.

## User Group Tax Settings

Meloncart extends user groups with two tax-related settings:

### Tax Exempt Groups

When a user group has the **Tax Exempt** flag enabled, customers in that group are not charged tax on any purchases. This is useful for wholesale customers, resellers, or tax-exempt organizations.

During checkout, if the customer belongs to a tax-exempt group, all tax calculations return zero for both product taxes and shipping taxes.

### Force Tax Exclusive Display

When a user group has the **Force Tax Exclusive Display** flag enabled, customers in that group always see prices without tax on the storefront, regardless of the store's default display setting. This is useful for B2B customers who typically work with net prices.

## Tax Breakdown in Orders

Each order stores a detailed tax breakdown:

- **Sales Taxes** — A breakdown of taxes on product items, grouped by tax name (e.g., "VAT 20%: $12.00", "GST 10%: $5.00").
- **Shipping Taxes** — A separate breakdown of taxes on the shipping cost.
- **Total Tax** — The combined total of all sales and shipping taxes, minus any discount-related tax adjustments.

This breakdown is visible on the order detail page in the backend and is used when generating invoices and financial reports.

::: info
Tax-exempt orders show zero values in the tax breakdown. The original product prices are preserved, but no tax amounts are calculated or charged.
:::

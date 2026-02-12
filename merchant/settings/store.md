---
subtitle: Configure your store settings.
---
# Store Configuration

Meloncart's store-wide settings are organized into several settings pages, all accessible under **Settings** in the backend navigation. These settings control tax behavior, shipping parameters, company information, and review policies.

## eCommerce Settings

Navigate to **Settings → eCommerce Settings** to configure tax display and default location settings.

### Tax Display

- **Prices Include Tax** — When enabled, product prices entered in the backend are treated as tax-inclusive. The system back-calculates the tax component from the entered price. When disabled, prices are treated as tax-exclusive and tax is added on top. See the [Taxes](../customer/taxes) documentation for details.
- **Display Prices with Tax** — Controls whether prices shown on the storefront include tax. This can differ from how prices are entered — for example, you might enter prices excluding tax but display them including tax.
- **Tax Inclusive Text** — An optional text label displayed alongside prices when they include tax (e.g., "incl. GST" or "incl. VAT"). This helps customers understand that the displayed price already includes tax.

### Default Location

The default location is used for tax calculations when a customer has not yet provided their address (for example, when browsing the catalog before checkout):

- **Default Country** — The country used for default tax rate calculations.
- **Default State** — The state or province within the default country.
- **Default City** — The default city.
- **Default ZIP** — The default postal code.

::: warning
When **Prices Include Tax** is enabled, you must set a default country. The default country's tax rate is used as the base rate for back-calculating tax-exclusive prices. Without it, the tax system cannot function correctly in tax-inclusive mode.
:::

## Shipping & Measurements

Navigate to **Settings → Shipping & Measurements** to configure units of measurement and the shipping origin address.

### Units of Measurement

- **Weight Unit** — The unit used for product weights throughout the store (e.g., kilograms, pounds, ounces, grams). This affects how weights are displayed and how they are passed to shipping carriers.
- **Dimension Unit** — The unit used for product dimensions (e.g., centimeters, inches, meters). Used for shipping calculations and product specifications.

### Shipping Origin Address

The origin address defines where your products ship from. This information is passed to shipping carrier APIs when calculating real-time shipping rates:

- **Sender First Name / Last Name** — The sender's name on shipping labels.
- **Company** — Your company name.
- **Phone** — A contact phone number for shipping purposes.
- **Street Address** — The origin street address.
- **City** — The origin city.
- **ZIP Code** — The origin postal code.
- **State** — The origin state or province.
- **Country** — The origin country.

::: info
The shipping origin is required for carrier-based shipping methods (such as UPS or FedEx integrations) to calculate accurate rates. For table rate shipping, the origin address is not used in rate calculations.
:::

## Company Information

Navigate to **Settings → Company Information** to configure your company details for invoices and packing slips.

- **Company Name** — Your business name as it appears on invoices and order documents.
- **Address & Contact Details** — Your company address and contact information, displayed on generated invoices and packing slips.

These details are used when generating printed or PDF documents for orders. Ensure they are accurate and match your business registration.

## Review Settings

Navigate to **Settings → Review Settings** to configure how customer reviews work on your storefront.

- **Allow Reviews** — Master toggle for the review system. When disabled, no reviews can be submitted. Defaults to enabled.
- **Require Approval** — When enabled, new reviews are held for moderation and must be approved by a backend administrator before they appear on the storefront. Defaults to enabled.
- **Require Login** — When enabled, only logged-in customers can submit reviews. Anonymous reviews are not allowed. Defaults to enabled.
- **Require Purchase** — When enabled, only customers who have purchased the product can leave a review. This verifies that the reviewer has an order containing the product. Defaults to disabled.
- **Rating Required** — When enabled, reviewers must include a star rating with their review text. When disabled, the rating is optional. Defaults to enabled.
- **Minimum Content Length** — The minimum number of characters required in the review text. Set to 0 to allow reviews with no text (rating only). Defaults to 0.

### Managing Reviews

Customer reviews are managed under **Shop → Reviews** in the backend. From here you can:

- View all submitted reviews with their status, rating, and associated product.
- Approve or reject pending reviews (when moderation is enabled).
- Delete inappropriate or spam reviews.

::: tip
If you enable **Require Approval**, make sure to check the reviews list regularly. Pending reviews do not appear on the storefront until they are approved.
:::

## Order Routes

Navigate to **Settings → Order Routes** to configure order statuses, status transitions, and notification rules. This settings page controls your order fulfillment workflow.

For detailed information about configuring order statuses and transitions, see the [Orders](../order/orders) documentation.

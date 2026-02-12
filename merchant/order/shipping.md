---
subtitle: Configure shipping methods, rates and restrictions.
---
# Shipping

Meloncart provides a flexible shipping system that supports multiple shipping methods with configurable rates, restrictions, and handling fees. Navigate to **Shop → Shipping Options** to manage your shipping methods.

## Shipping Methods

Each shipping method represents a way to deliver products to customers. Click **New Shipping Method** to create one. Every shipping method has the following core settings:

- **Name** — The display name shown to customers at checkout (e.g., "Standard Shipping", "Express Delivery").
- **Code** — A unique internal identifier for the method.
- **Description** — An optional description displayed to customers during shipping method selection.
- **Enabled** — Whether the method is available to customers on the storefront.
- **Enabled for Backend** — Whether the method is available when creating or editing orders in the backend. This allows you to have methods that are only available for admin-created orders or vice versa.

### Shipping Drivers

Each shipping method is powered by a shipping driver that determines how rates are calculated. The driver is selected when creating the shipping method and defines the method's configuration options.

#### Table Rate Shipping

The built-in **Table Rate** driver calculates shipping costs based on configurable rate tables. You define rates in a table with columns for location (country, state, ZIP code) and price thresholds, and the system looks up the applicable rate based on the customer's address and order details.

This is the most commonly used driver for stores that manage their own shipping rates rather than integrating with a carrier API.

Additional shipping drivers can be installed through plugins to support real-time rate calculation from carriers such as UPS, FedEx, or Australia Post.

### Handling Fees

Every shipping method can have a **Handling Fee** added on top of the calculated shipping rate. This fixed amount covers packaging, labor, or other fulfillment costs. The handling fee is added to the shipping quote before it is displayed to the customer.

### Weight Restrictions

You can set weight limits on a shipping method:

- **Minimum Weight** — The minimum total order weight required for this method to be available.
- **Maximum Weight** — The maximum total order weight allowed for this method.

If the order's total weight falls outside these limits, the shipping method is not offered to the customer. This is useful for separating lightweight (letter post) and heavyweight (freight) shipping options.

### Country Restrictions

Shipping methods can be restricted to specific countries. Under the **Countries** tab, assign one or more countries where this method is available.

- If countries are assigned, the method only appears when the customer's shipping address matches one of the listed countries.
- If no countries are assigned, the method is available to all countries.

This allows you to set up different shipping methods for domestic and international delivery, or to restrict certain methods to specific regions.

### User Group Restrictions

Shipping methods can also be restricted to specific customer groups. Under the **User Groups** tab, assign one or more groups.

- If groups are assigned, only customers in those groups see this method at checkout.
- If no groups are assigned, the method is available to all customers.

This is useful for offering special shipping rates to wholesale customers or members.

### Taxable Shipping

The **Taxable** checkbox determines whether tax is calculated on the shipping cost. When enabled, shipping tax is calculated based on the customer's location using the same tax system that applies to products. The shipping tax is shown as a separate line item in the order's tax breakdown.

## Child Shipping Options

Some shipping methods support child options — multiple shipping tiers within a single method. For example, a carrier integration might offer both "Standard" and "Express" options under the same method.

When a shipping method has child options, the customer sees them as separate selectable choices at checkout, each with its own rate. The selected child option is recorded on the order so you know which tier the customer chose.

## How Shipping Quotes Work

When a customer reaches the shipping step during checkout, the system calculates shipping quotes for all applicable methods:

1. **Filter methods** — Only enabled methods that match the customer's country, user group, and order weight are considered.
2. **Get quotes** — Each applicable method's driver calculates a shipping rate based on the order details (items, weight, dimensions, destination, order total).
3. **Add handling fees** — Handling fees are added to each quote.
4. **Calculate shipping tax** — If the method is taxable, shipping tax is calculated and included.
5. **Display to customer** — The available methods and their prices are presented for the customer to choose from.

::: tip
If a shipping method's driver returns no quote (for example, the carrier API is unavailable or the destination is not serviceable), that method is silently excluded from the options shown to the customer.
:::

## Free Shipping

Free shipping can be applied in several ways:

- **Cart price rules** — Use the "Apply free shipping to the cart products" cart rule action to waive shipping costs when conditions are met (e.g., orders over $100).
- **Manual override** — When editing an order in the backend, you can toggle the free shipping flag to waive the shipping cost.
- **Shipping quote override** — Set a manual shipping quote of zero on an order to override the calculated rate.

When free shipping is active, the shipping cost displays as zero regardless of the calculated rate.

## No Shipping Required

For orders that contain only digital products or services, a special **No Shipping Required** method is used. This method is created during installation and has the code `no_shipping_required`.

When all items in an order are from product types that do not have the **Has Shipping** feature enabled, the checkout process skips the shipping step entirely and uses this method automatically.

## Per-Product Shipping Costs

In addition to method-level rates, individual products can have their own shipping cost defined. When a product has a per-product shipping cost, that amount is added to the shipping method's calculated rate. This allows you to charge extra shipping for oversized or special-handling items while still using your standard shipping methods.

## Shipping Origin

The shipping origin address — where your products ship from — is configured under **Settings → Shipping & Measurements**. This address is provided to carrier-based shipping drivers when calculating real-time rates. It includes:

- Sender name and company
- Street address, city, ZIP code
- State and country
- Phone number

For details on configuring the shipping origin, see the [Store Configuration](../settings/store) documentation.

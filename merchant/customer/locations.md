---
subtitle: Manage countries and states used for shipping and taxes.
---
# Locations

Location data in Meloncart is provided by the **RainLab.Location** plugin. Countries and states are used throughout the store for shipping address validation, shipping method restrictions, tax zone calculations, and default store location settings.

## Countries and States

Navigate to **Settings → Locations** (provided by the RainLab.Location plugin) to manage the list of available countries and states. This data is pre-seeded with a comprehensive list of world countries and their subdivisions.

### Enabling Countries

By default, all countries are available. You can disable countries that you do not ship to or do not want customers to select during checkout. Disabled countries will not appear in country dropdown menus on the storefront.

To enable or disable a country, find it in the country list and toggle its status. You can also manage which states or provinces are available within each country.

### States and Provinces

Each country can have associated states, provinces, or regions. These are used in address forms and for location-based calculations such as tax rates and shipping restrictions.

## How Locations Are Used

Location data connects to several areas of your store:

### Shipping Methods

Shipping methods can be restricted to specific countries. When configuring a shipping method under **Shop → Shipping Options**, you can assign one or more countries. If countries are assigned, the shipping method is only available to customers with a shipping address in one of those countries. If no countries are assigned, the method is available everywhere.

For more details, see the [Shipping](../order/shipping) documentation.

### Tax Calculation

Tax rates are calculated based on the customer's location. The tax system uses the customer's shipping address (country and state) to determine which tax rates apply. Different countries and states can have different tax rates configured through tax classes.

For more details, see the [Taxes](./taxes) documentation.

### Default Store Location

Your store has a default location configured under **Settings → eCommerce Settings**. This default country, state, city, and ZIP code are used as the fallback location for tax calculations when a customer has not yet entered their address — for example, when browsing the catalog before checkout.

For more details, see the [Store Configuration](../settings/store) documentation.

### Shipping Origin

The shipping origin address, configured under **Settings → Shipping & Measurements**, defines where your products ship from. This address is provided to shipping carriers when calculating real-time shipping rates.

## Address Forms

On the storefront, checkout address forms use the location data to populate country and state dropdowns. When a customer selects a country, the state dropdown updates to show the available states for that country.

In the backend, order forms use the same location data for billing and shipping address fields. When editing an order, changing the country updates the available states accordingly.

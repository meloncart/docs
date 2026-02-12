---
subtitle: Manage product manufacturers and brands.
---
# Manufacturers

Manufacturers represent the brands or companies that produce the products in your store. Assigning a manufacturer to a product helps customers filter and browse by brand, and provides a central place to manage brand information like logos, descriptions, and contact details.

Manufacturers are accessed from the Products page toolbar. Click the **Manufacturers** button (group icon) on the Products list page to open the manufacturers list.

## Creating a Manufacturer

Click **New Manufacturer** to create a new manufacturer. The following fields are available:

### Manufacturer Tab

- **Name** — The display name of the manufacturer or brand. This is the only required field.
- **Slug** — Automatically generated from the name, used to build the manufacturer's URL on the storefront. You can customize it if needed.
- **Description** — A rich text description of the manufacturer, which can be displayed on a dedicated manufacturer page on the storefront.

### Address Tab

Manufacturers can optionally store contact and address information:

- **Street Address** — The manufacturer's street address.
- **City** — City name.
- **Zip / Postal Code** — Postal or ZIP code.
- **Country** — Select from enabled countries.
- **State** — Select from states within the chosen country.
- **Phone Number** — Contact phone number.
- **Fax Number** — Fax number.
- **Email** — Contact email address.
- **Website URL** — The manufacturer's website.

### Logo Tab

Upload a logo image for the manufacturer. This can be used by your theme to display brand logos on product pages, manufacturer listings, or in navigation.

## Assigning Products to a Manufacturer

To assign a manufacturer to a product, open the product and select the manufacturer from the **Manufacturer** dropdown on the Product tab. Each product can belong to one manufacturer.

You can filter the product list by manufacturer using the **Manufacturer** filter in the product list toolbar.

## Manufacturer on the Storefront

Your theme can display manufacturer information on the storefront in several ways:

- **Product pages** — Show the manufacturer name and logo on product detail pages.
- **Manufacturer pages** — Create a dedicated page that displays the manufacturer's description, logo, and a list of their products.
- **Product filters** — Allow customers to filter products by manufacturer in category listings.

The catalog component supports looking up manufacturers by slug or ID, making it easy to build dedicated manufacturer pages. See the [Catalog component](../../developer/components/catalog) documentation for details.

---
subtitle: Learn how to manage products, configure your store and use reporting tools.
---
# Merchant Guide

Welcome to Meloncart, a full-featured e-commerce plugin for October CMS. This guide is written for store operators and covers everything you need to know about managing your online store through the backend administration panel.

## What is Meloncart

Meloncart provides a complete e-commerce solution built natively for October CMS. It handles product catalogs, shopping carts, checkout, payments, shipping, inventory tracking, price rules, discount coupons, and customer management — all from within the familiar October CMS backend.

The plugin is designed to be theme-driven, meaning your storefront's appearance and behavior are controlled entirely by your CMS theme. A reference Commerce Theme is available as a starting point for building your own storefront.

## Plugin Dependencies

Meloncart builds on several established plugins to provide a complete commerce stack. Each dependency is installed automatically when you install Meloncart.

| Plugin | Purpose |
|--------|---------|
| **Responsiv.Pay** | Payment gateway processing and invoicing |
| **Responsiv.Currency** | Multi-currency display and formatting |
| **RainLab.User** | Customer accounts and authentication |
| **RainLab.UserPlus** | Extended customer profile fields |
| **RainLab.Location** | Country and state data for shipping and taxes |

## Installation

Install Meloncart using Composer from your project root:

```bash
composer require meloncart/shop-plugin
```

After installation, run the database migrations:

```bash
php artisan october:migrate
```

This creates all the necessary database tables and seeds the default data, including a default product type and initial order statuses.

## Backend Navigation

Once installed, a new **Shop** menu appears in the backend main navigation. It contains the following sections:

- **Categories** — Organize products into a hierarchical category tree
- **Products** — Create and manage your product catalog
- **Orders** — View and process customer orders
- **Shipping Options** — Configure shipping methods and rates
- **Price Rules** — Set up catalog-level pricing rules that affect product display prices
- **Discounts** — Create cart-level discount rules and coupon codes
- **Reviews** — Moderate customer product reviews and ratings

Store-wide settings are found under **Settings** in the backend, grouped under the **Shop** category:

- **Order Routes** — Define order statuses, transitions, and notification rules
- **Shipping & Measurements** — Set weight and dimension units, and the shipping origin address
- **Company Information** — Your company name, address, and logo for invoices and packing slips
- **eCommerce Settings** — Tax display preferences and default location settings
- **Review Settings** — Configure review moderation and rating options

## Quick Start

Here is a quick walkthrough to get your first product listed and visible on the frontend.

### 1. Set Up a Tax Class

Navigate to **Settings → Tax** (provided by the Responsiv.Pay plugin) and ensure you have at least one tax class defined. Every product requires a tax class assignment, even if the rate is zero.

### 2. Create a Category

Go to **Shop → Categories** and click **New Category**. Enter a name such as "General" and save. Categories are used to organize your products and are required when creating a product.

### 3. Create a Product

Go to **Shop → Products** and click **New Product**. Fill in the required fields:

- **Name** — The display name of the product
- **SKU** — A unique stock keeping unit identifier
- **Price** — The base selling price
- **Tax Class** — Select the tax class you created
- **Categories** — Assign the product to your category

Add a description and at least one product image, then save. Your product is now in the catalog.

### 4. View on the Frontend

If you have the Commerce Theme (or a custom theme with catalog components) installed and active, navigate to your store's product listing page to see the product. Each product has a detail page accessible through its URL slug.

::: tip
The Commerce Theme provides a complete, working storefront out of the box. It is the best way to get started quickly and serves as a reference for building a custom theme.
:::

## Next Steps

Continue reading to learn more about the specifics of managing your store:

- [Categories](./product/categories) — Organize your products with a hierarchical category tree
- [Products](./product/products) — Create and configure products with options, extras, and pricing
- [Variants](./product/variants) — Set up product variations like size and color combinations
- [Inventory](./product/inventory) — Track stock levels and manage availability
- [Discounts](./product/discounts) — Create price rules and coupon-based discounts

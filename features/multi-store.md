---
subtitle: Run multiple storefronts from a single installation.
---
# Multi-Store

Meloncart supports running multiple independent storefronts from a single October CMS installation. Each store gets its own product catalog, categories, orders, pricing rules and settings — while sharing the same backend, codebase and theme.

## Separate Stores, One Admin

Each store operates independently. Products created in one store don't appear in another. Orders, categories, shipping methods and price rules are all scoped per store. Switch between stores using the site picker in the backend navigation.

Shared resources like customer accounts, tax classes, payment gateways and order statuses remain global, so you don't have to configure them twice.

## Multi-Language Support

Each store can support multiple languages. Within a store, product names, descriptions, category titles and URLs can all be translated per locale. October CMS handles the routing — whether you use separate domains, subdomains or URL prefixes.

| Site | URL |
|------|-----|
| US Store (English) | `us.example.com` |
| EU Store (English) | `eu.example.com` |
| EU Store (French) | `eu.example.com/fr` |

## Multi-Currency Pricing

Each store can display prices in a different currency. Prices are stored in a base currency and automatically converted using exchange rates — or you can set fixed price overrides for specific currencies when you need round numbers or market-specific pricing.

## Per-Site Product Visibility

Control which products appear on which sites within a store. Show different product selections to different regions or locales, without maintaining separate catalogs.

## One Theme, Every Store

Your theme is shared across all stores and sites. The same pages, partials and layouts render content from whichever store the current request belongs to. No theme duplication needed — just build once and let Meloncart handle the rest.

## Easy Migration

Already running a single store? Adding a second is straightforward. Create a new site group, assign your existing site to the first group, and your current data stays intact. Then start building your second store alongside the first.

::: tip
For detailed setup instructions, see the [Multi-Store Setup](../merchant/settings/multi-store) guide in the Merchant documentation.
:::

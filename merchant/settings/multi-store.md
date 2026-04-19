---
subtitle: Run multiple storefronts from a single installation.
---
# Multi-Store Setup

Meloncart supports running multiple storefronts from a single October CMS installation using the [Multisite](https://docs.octobercms.com/4.x/cms/features/multisite.html) feature. Each store can have its own products, categories, pricing rules, orders, and settings while sharing the same backend and codebase.

## How It Works

October CMS organizes sites into **site groups**. A site group represents a single store, and each group can contain multiple sites: one per language or locale. For example:

| Site Group | Sites |
|-----------|-------|
| US Store | English (primary) |
| EU Store | English, French, German |
| JP Store | Japanese |

Meloncart scopes all shop data by site group. When you create a product in the US Store, it only appears in the US Store. The EU Store has its own separate product catalog, categories, orders, and settings. Within a site group, content is shared across all locale sites and can be translated.

### Site Groups vs Sites

It is important to understand the distinction:

- **Site Group** = A store. Products, orders, categories, and settings belong to a site group.
- **Site** = A locale within a store. A French site and an English site within the same group share the same products, but product names and descriptions can be translated into each language.

## Setting Up Multiple Stores

### 1. Create Site Groups

Navigate to **Settings → Manage Sites** in the backend. Create a site group for each store you want to operate. Within each group, create one or more sites for the languages you want to support.

::: tip
Your primary site must belong to a site group. If you are adding multi-store support to an existing installation, create a site group and assign your existing primary site to it.
:::

### 2. Configure Store Settings

Each store has its own independent settings. After switching to a store's site in the backend (using the site picker in the top navigation), configure the following under **Settings**:

- **eCommerce Settings**: Tax display preferences and default location for each store
- **Shipping & Measurements**: Weight and dimension units, shipping origin address
- **Company Information**: Company name and contact details for invoices
- **Review Settings**: Review moderation policies

Settings are scoped per store, so your US Store can use pounds and inches while your EU Store uses kilograms and centimeters.

### 3. Create Store Content

With your target store selected in the site picker, create products, categories, manufacturers, and other catalog content. All records created while a store is active are automatically assigned to that store.

The following data is scoped per store:

| Data | Per Store | Translatable |
|------|-----------|-------------|
| Products | Yes | Name, slug, title, descriptions |
| Categories | Yes | Name, slug, title, descriptions |
| Manufacturers | Yes | Name, slug, description |
| Custom Groups | Yes | Name |
| Shipping Methods | Yes | Name, description |
| Cart Price Rules | Yes | Name, description |
| Catalog Price Rules | Yes | Name, description |
| Product Option Sets | Yes | Name |
| Product Extra Sets | Yes | Name |
| Product Property Sets | Yes | Name |
| Orders | Yes |: |
| Coupons | Yes |: |
| Reviews | Yes |: |

### 4. Translate Content

If a site group contains multiple locale sites, you can translate product names, descriptions, category names, and other text fields into each language. Switch to the target locale using the site picker, then edit the record to provide translated content.

Translatable fields are marked in the table above. Fields with slug translations also update the frontend URLs for that locale.

## Storefront Routing

Each site can have its own domain or URL prefix. October CMS routes incoming requests to the correct site based on the hostname and URL, and Meloncart automatically loads the corresponding store's data.

For example:

| Site | URL |
|------|-----|
| US Store (English) | `us.example.com` |
| EU Store (English) | `eu.example.com` |
| EU Store (French) | `eu.example.com/fr` |

Your theme is shared across all sites. The same pages, partials, and layouts render content from whichever store the current request belongs to. No theme changes are needed to support multiple stores.

## Backend Workflow

When working in the backend, the site picker in the top navigation controls which store you are managing. Switching sites changes the visible data throughout the backend:

- The product list shows only products from the selected store
- The order list shows only orders from the selected store
- Settings pages show the selected store's configuration

::: warning
Always verify which site is selected before creating or editing records. Records are assigned to the active store at the time of creation.
:::

## Shared Data

Some data is shared globally across all stores and is not scoped by site group:

- **Customers**: User accounts are shared. A customer can place orders in any store.
- **Tax Classes**: Tax configuration is global and applies across stores.
- **Order Statuses**: Status definitions and transitions are shared.
- **Payment Gateways**: Payment method configuration is global.
- **Product Types**: Product type definitions are shared.
- **Countries & States**: Location data is global.

## Multi-Currency Pricing

Meloncart supports displaying and managing prices in different currencies across your stores using the [Currency](https://octobercms.com/plugin/responsiv-currency) plugin. Each site can have its own display currency, and prices are automatically converted using exchange rates, or you can set fixed price overrides for specific currencies.

### Currency Tiers

The currency system uses three tiers, each falling back to the one above it:

| Currency | Scope | Set In | Purpose |
|----------|-------|--------|---------|
| **Default** | Global | Settings → Currencies | Anchor for all conversions; used when no other currency is configured |
| **Base** | Site Group | Settings → Site Groups | Stored currency for all sites in a group; defaults to the global default |
| **Site** | Site Definition | Settings → Site Definitions | Display currency for customers visiting that site; defaults to the base |

### Setting Up Currencies

1. **Create currencies**: Navigate to **Settings → Currencies** and create the currencies your stores will use. Mark one as the **Default**.

2. **Configure exchange rates**: Navigate to **Settings → Exchange Rates** and set up currency pairs. You can set fixed rates manually or use an automated provider (such as Fixer.io or FastForex) for real-time rates.

3. **Set a base currency per store**: If your stores use different base currencies (e.g. US Store in USD, EU Store in EUR), navigate to **Settings → Site Groups** and select a **Base Currency** for each group. This step is optional: when left unset, the global default is used.

4. **Set a display currency per site**: Navigate to **Settings → Site Definitions** and set the **Currency** for each site. This determines what currency customers see on the storefront.

For example:

| Site | Locale | Currency |
|------|--------|----------|
| US Store (English) | `en` | USD |
| EU Store (English) | `en` | EUR |
| EU Store (French) | `fr` | EUR |
| UK Store (English) | `en` | GBP |

### How Prices Work

Product prices are always stored in the store's base currency. When a customer visits a site with a different display currency, prices are automatically converted using exchange rates.

For example, if a product costs **USD 100** in the US Store and the USD → EUR exchange rate is 0.92, customers on the EU Store see **EUR 92.00** automatically.

### Fixed Price Overrides

Sometimes exchange-rate conversion is not ideal: you may want to set round numbers or market-specific prices. Meloncart supports fixed price overrides for any currency.

When editing a product on a non-base currency site, each price field shows the auto-converted value in a disabled input. Use the **Override** link to enter a fixed price for that currency. Use the **Clear** link to remove the override and revert to automatic conversion.

::: tip
Fixed overrides are stored separately from the base price. Clearing an override does not affect the base price: it simply reverts to using the exchange rate.
:::

### Displaying Prices on the Storefront

Use the `currency` Twig filter with the `site` option to display prices in the visitor's currency:

```twig
{{ product.price|currency({ site: true }) }}
```

The current site's currency code is available as:

```twig
{{ this.site.currency_code }}
```

## Per-Site Product Visibility

Within a store, all sites share the same product catalog by default. However, you can control which products appear on which sites using per-site visibility.

To restrict a product to specific sites, edit the product and navigate to the **Visibility** tab. Check **Limit Visibility to Specific Sites**, then select the sites where the product should appear. Products with this setting unchecked remain visible on all sites in the store.

This works bidirectionally: you can hide products on the primary site while showing them on a regional site, or vice versa. For example, a store with English, French, and Colombian sites might show 12 products on the English site but 14 on the Colombian site.

::: tip
Per-site visibility uses an opt-in model. When you add a new site to a store, restricted products will not appear on the new site until you explicitly add it to the product's visibility list.
:::

## Migrating an Existing Store

If you have an existing single-store installation and want to add a second store:

1. Create a site group under **Settings → Manage Sites** and assign your existing primary site to it.
2. Your existing data will be automatically associated with the primary site group.
3. Create a second site group for your new store and begin adding content to it.

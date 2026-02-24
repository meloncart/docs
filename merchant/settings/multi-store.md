---
subtitle: Run multiple storefronts from a single installation.
---
# Multi-Store Setup

Meloncart supports running multiple storefronts from a single October CMS installation using the [Multisite](https://docs.octobercms.com/4.x/cms/features/multisite.html) feature. Each store can have its own products, categories, pricing rules, orders, and settings while sharing the same backend and codebase.

## How It Works

October CMS organizes sites into **site groups**. A site group represents a single store, and each group can contain multiple sites — one per language or locale. For example:

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

- **eCommerce Settings** — Tax display preferences and default location for each store
- **Shipping & Measurements** — Weight and dimension units, shipping origin address
- **Company Information** — Company name and contact details for invoices
- **Review Settings** — Review moderation policies

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
| Orders | Yes | — |
| Coupons | Yes | — |
| Reviews | Yes | — |

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

- **Customers** — User accounts are shared. A customer can place orders in any store.
- **Tax Classes** — Tax configuration is global and applies across stores.
- **Order Statuses** — Status definitions and transitions are shared.
- **Payment Gateways** — Payment method configuration is global.
- **Product Types** — Product type definitions are shared.
- **Countries & States** — Location data is global.

## Migrating an Existing Store

If you have an existing single-store installation and want to add a second store:

1. Create a site group under **Settings → Manage Sites** and assign your existing primary site to it.
2. Your existing data will be automatically associated with the primary site group.
3. Create a second site group for your new store and begin adding content to it.

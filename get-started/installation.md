---
subtitle: Install Meloncart and get your store up and running.
---
# Installation

Getting started with Meloncart takes just a few steps. You'll set up October CMS, connect your project to the Marketplace, and add Meloncart along with a ready-made storefront theme.

## 1. Try the Demo First

Before setting anything up, take Meloncart for a spin. The live demo gives you full access to the backend admin panel and a working storefront, so you can explore products, orders, checkout and every feature covered in this documentation.

This is the fastest way to confirm that Meloncart is the right fit for your project — no installation required.

::: tip
Visit the [Meloncart demo](https://meloncart.com) to explore the platform before committing to an install.
:::

## 2. Install October CMS

Meloncart runs on October CMS, a Laravel-based content management system. If you don't have an October CMS project yet, you'll need to set one up first.

There are several ways to get started:

- **Laravel installer** — create a new project with `composer create-project october/october myproject`
- **Web installer** — download the installer and follow the browser-based setup wizard
- **Docker** — use a Docker image for a containerized development environment

Check the [October CMS installation guide](https://docs.octobercms.com/4.x/setup/installation.html) for detailed instructions and server requirements.

## 3. Create a Free October CMS Account

To install plugins from the Marketplace, you'll need an October CMS account. Registration is free and takes less than a minute.

1. Visit [octobercms.com](https://octobercms.com) and create an account
2. Create a new project in your account dashboard
3. Generate a **project key** — this connects your local installation to the Marketplace

Then attach the project key to your October CMS installation:

```bash
php artisan project:set <your-project-key>
```

This unlocks access to the full plugin and theme ecosystem, including free community plugins and paid products like Meloncart.

## 4. Add Meloncart to Your Project

With your project connected, you're ready to install Meloncart. Head to the October CMS Marketplace, add Meloncart to your project, and choose the Fresh Theme to get a complete working storefront out of the box.

- **Meloncart** — the core eCommerce plugin with products, orders, payments, shipping, and everything else
- **Fresh Theme** — a fully functional reference storefront, ready to use as-is or customize to your needs

All dependencies — payment processing, multi-currency support, customer accounts, and location data — are installed automatically. There's nothing extra to configure before you can start building.

## 5. Sync and Install

From the October CMS backend, navigate to **Settings → Updates & Plugins** and click **Sync** to pull everything down. This installs the Meloncart plugin, the Fresh Theme, and all dependencies in one step.

Alternatively, sync from the command line:

```bash
php artisan project:sync
php artisan october:migrate
```

The migration creates all necessary database tables and seeds default data, including product types and initial order statuses.

## You're Ready

Once the sync completes, a new **Shop** menu appears in the backend navigation. From here you can start adding products, configuring shipping and payment methods, and customizing your store.

- [Merchant Guide](/merchant/introduction) — learn how to manage your store day-to-day
- [Developer Guide](/developer/introduction) — build and customize your storefront with components and templates
- [Features](/features/) — explore everything Meloncart can do

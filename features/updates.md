---
subtitle: Simple updates that won't break your store.
---
# Software Updates

Meloncart makes updates effortless. Apply updates with a single click from the admin panel, or run them manually through Composer — either way, your store stays current without the hassle.

## One-Click Updates

When a new version is available, you'll see a notification in the admin panel. Click to update and Meloncart handles the rest — pulling the latest packages via Composer and running any necessary migrations behind the scenes.

## Or Update via Composer

Prefer the command line? Update directly with Composer like any other Laravel package:

```bash
composer update meloncart/shop-plugin
php artisan october:migrate
```

Updates are published regularly and follow semantic versioning, so you know what to expect from each release.

## Non-Destructive Updates

Updates never overwrite your theme files, custom plugins or configuration. Your templates, stylesheets, custom modules and content remain untouched — only the core package is updated. This means you can update with confidence, knowing your storefront stays exactly as you built it.

## Included with Your License

Your Meloncart license includes ongoing updates to the core plugin. Bug fixes, performance improvements and new features are all delivered through the standard update process.

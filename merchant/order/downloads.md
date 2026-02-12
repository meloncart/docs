---
subtitle: Manage digital product downloads for customers.
---
# Digital Downloads

Digital downloads allow customers to receive files after purchasing a product. This is used for selling digital goods such as software, ebooks, music, templates, or any other downloadable content.

## Setting Up Digital Products

To sell downloadable products, you need two things: a product type with files enabled, and files attached to the product.

### 1. Product Type

Make sure the product uses a product type with the **Enable Files** flag checked. The default "Downloadable" product type has this flag enabled. See [Product Types](../product/product-types) for details.

### 2. Uploading Files

Open the product and navigate to the **Files** tab (only visible when files are enabled on the product type). Upload one or more files that customers will receive after purchase. You can upload any file type — ZIP archives, PDFs, audio files, software installers, etc.

A product can have multiple downloadable files. When a product has multiple files, the download system provides access to all of them.

## How Downloads Work

The download system uses secure, unique download links to provide file access:

1. **Purchase** — A customer purchases a product with downloadable files.
2. **Key Generation** — After payment is confirmed, a unique download key is generated for the order item. This key is a 40-character random string that acts as a bearer token for accessing the files.
3. **Download Access** — The customer accesses their download link, which validates the key and serves the file.

### Download URL Format

Download links follow this pattern:

```
/meloncart/shop/download/{key}
/meloncart/shop/download/{key}/{fileId}
```

The first format downloads the first (or only) file. The second format downloads a specific file when the product has multiple downloadable files.

## Download Controls

The download system supports two controls for managing access:

### Expiration

Downloads can be set to expire after a specific date. Once expired, the download link returns an error. If no expiration is set, the download link remains valid indefinitely.

### Download Count

The system tracks how many times each download link has been used. This can be used to enforce download limits, preventing unlimited redistribution of purchased files.

## Security

Download links are secured through several layers:

- **Unique keys** — Each download key is a 40-character random alphanumeric string, making it computationally infeasible to guess.
- **Validation** — Every download request validates that the key exists, the product has files, the link hasn't expired, and the download limit hasn't been reached.
- **File isolation** — Only files attached to the purchased product are accessible through the download link. There is no way to access files from other products.
- **No authentication required** — Download links work without requiring the customer to be logged in, making them easy to share via email or order confirmation pages.

::: tip
For best results, upload your digital products as ZIP archives. This packages all related files into a single download, reduces transfer size, and works reliably across all browsers and operating systems.
:::

::: warning
Download links act as bearer tokens — anyone with the link can download the file. If you need stricter access control, consider setting short expiration windows or low download limits.
:::

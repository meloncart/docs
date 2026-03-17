---
subtitle: Display download links for digital products.
---
# Digital Downloads

This guide covers how to display download links for digital products in your theme. For an overview of how the download system works, see the [merchant documentation](../../merchant/order/downloads).

## Order Detail Page

The most common place to display download links is on the customer's order detail page (`account/order.htm`). Loop through the order items and check each one for downloadable files.

```twig
{% for item in order.items %}
    <div>
        <strong>{{ item.product.name }}</strong>

        {% if item.isDownloadable() %}
            {% if item.canDownload() %}
                <a href="{{ item.getDownloadUrl() }}">
                    Download
                </a>
                {% if item.download_expires_at %}
                    <small>
                        Expires {{ item.download_expires_at|date('M d, Y') }}
                    </small>
                {% endif %}
            {% elseif item.isDownloadExpired() %}
                <span class="text-muted">Download expired</span>
            {% elseif item.isDownloadLimitReached() %}
                <span class="text-muted">Download limit reached</span>
            {% endif %}
        {% endif %}
    </div>
{% endfor %}
```

### Multiple Files

When a product has more than one downloadable file, use `getDownloadableFiles()` to list each file individually.

```twig
{% if item.isDownloadable() and item.canDownload() %}
    {% set files = item.getDownloadableFiles() %}
    {% for file in files %}
        <a href="{{ item.getDownloadUrl(file.id) }}">
            {{ file.file_name }} ({{ file.file_size|filesize }})
        </a>
    {% endfor %}
{% endif %}
```

### Download Status

Use the helper methods on the order item to display the current state of a download.

| Method | Returns | Description |
|--------|---------|-------------|
| `isDownloadable()` | `bool` | Product has downloadable files |
| `canDownload()` | `bool` | Download is currently permitted |
| `isDownloadExpired()` | `bool` | Download link has expired |
| `isDownloadLimitReached()` | `bool` | Download limit has been reached |
| `getDownloadUrl()` | `string\|null` | Public download URL |
| `getDownloadableFiles()` | `Collection<File>` | Available files for download |

The `canDownload()` method returns `true` only when the order item has a download key, the link has not expired, and the download limit has not been reached. Use it as the primary check before rendering a download link.

## Payment Confirmation Page

You can also display download links on the payment confirmation page (`shop/payment.htm`) so customers can access their files immediately after purchase.

```twig
{% set order = checkout.getOrder %}
{% if order %}
    {% for item in order.items %}
        {% if item.isDownloadable() and item.canDownload() %}
            <div>
                <strong>{{ item.product.name }}</strong>
                <a href="{{ item.getDownloadUrl() }}">
                    Download Now
                </a>
            </div>
        {% endif %}
    {% endfor %}
{% endif %}
```

## Email Notifications

Download links can be included in order confirmation emails by customizing the `shop:order_thankyou` mail template. Edit it in the backend at **Settings > Mail Templates** or override the `shop_order_content` mail partial.

The mail template has access to the `order` variable, which includes all order items and their download methods.

```html
<!-- Add to shop:order_thankyou or shop_order_content partial -->
@foreach ($order->items as $item)
    @if ($item->isDownloadable() && $item->canDownload())
        <tr>
            <td>
                <strong>{{ $item->product->name }}</strong><br />
                <a href="{{ $item->getDownloadUrl() }}">Download</a>
                @if ($item->download_expires_at)
                    <br />
                    <small>
                        Expires {{ $item->download_expires_at->format('M d, Y') }}
                    </small>
                @endif
            </td>
        </tr>
    @endif
@endforeach
```

::: tip
Mail templates use Blade syntax, not Twig. Use `$item->method()` instead of `item.method()` and `@if` / `@foreach` instead of `{% if %}` / `{% for %}`.
:::

## Dedicated Downloads Page (Optional)

You can create a dedicated "My Downloads" page in the customer account area that aggregates all downloadable files across orders. This page uses the `[orders]` component to access the customer's order history.

### Page Definition

Create `pages/account/downloads.htm`:

```ini
title = "My Downloads"
url = "/account/downloads"
layout = "account"
is_hidden = 0

[session]
security = "user"

[orders]
==
```

### Page Content

```twig
{% set orderCollection = orders.getOrders %}

{% set hasDownloads = false %}
{% for order in orderCollection %}
    {% for item in order.items %}
        {% if item.isDownloadable() %}
            {% set hasDownloads = true %}
        {% endif %}
    {% endfor %}
{% endfor %}

{% if hasDownloads %}
    <table class="table">
        <thead>
            <tr>
                <th>Product</th>
                <th>Order</th>
                <th>Date</th>
                <th>Status</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {% for order in orderCollection %}
                {% for item in order.items %}
                    {% if item.isDownloadable() %}
                        <tr>
                            <td>{{ item.product.name }}</td>
                            <td>#{{ order.id }}</td>
                            <td>{{ order.ordered_at|date('M d, Y') }}</td>
                            <td>
                                {% if item.canDownload() %}
                                    <a href="{{ item.getDownloadUrl() }}">
                                        Download
                                    </a>
                                    {% if item.download_count > 0 %}
                                        <small class="text-muted">
                                            ({{ item.download_count }}x)
                                        </small>
                                    {% endif %}
                                {% elseif item.isDownloadExpired() %}
                                    <span class="text-muted">Expired</span>
                                {% elseif item.isDownloadLimitReached() %}
                                    <span class="text-muted">Limit reached</span>
                                {% else %}
                                    <span class="text-muted">Pending payment</span>
                                {% endif %}
                            </td>
                            <td>
                                {% if item.download_expires_at %}
                                    <small class="text-muted">
                                        Expires {{ item.download_expires_at|date('M d, Y') }}
                                    </small>
                                {% endif %}
                            </td>
                        </tr>
                    {% endif %}
                {% endfor %}
            {% endfor %}
        </tbody>
    </table>
{% else %}
    <p class="text-muted">You have no downloadable products.</p>
{% endif %}
```

### Account Sidebar

Add a link to the downloads page in your account sidebar partial:

```twig
<a href="/account/downloads">
    My Downloads
</a>
```

::: info
The dedicated downloads page is optional. For stores with only a few digital products, displaying download links on the order detail page is usually sufficient.
:::
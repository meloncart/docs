---
subtitle: Hook into Meloncart events.
---
# Events

Meloncart fires events throughout the order lifecycle, cart operations, and product management. You can listen to these events in your plugin's [`boot()` method](https://docs.octobercms.com/4.x/extend/system/plugins.html) to extend or customize store behavior.

```php
public function boot()
{
    \Event::listen('shop.newOrder', function($order) {
        // Handle new order
    });
}
```

## Order Events

### shop.beforePlaceOrder

Fires before a new order is placed via checkout. Use this to perform pre-order validation or preparation.

| Parameter | Type | Description |
| --- | --- | --- |
| `$cartName` | string | Name of the cart being converted to an order |

**Return:** Not checked.

```php
Event::listen('shop.beforePlaceOrder', function($cartName) {
    // Validate external conditions before order placement
    if (!ExternalService::isAvailable()) {
        throw new ApplicationException('Service unavailable, please try again.');
    }
});
```

### shop.placeOrderError

Fires when an error occurs during the order placement process.

| Parameter | Type | Description |
| --- | --- | --- |
| `$message` | string | The error message |
| `$cartName` | string | Name of the cart |

**Return:** Not checked.

```php
Event::listen('shop.placeOrderError', function($message, $cartName) {
    Log::error('Order placement failed', [
        'error' => $message,
        'cart' => $cartName
    ]);
});
```

### shop.beforeCreateOrderRecord

Fires before a new order record is saved to the database, whether via checkout or the admin panel.

| Parameter | Type | Description |
| --- | --- | --- |
| `$order` | Order | The order model about to be created |

**Return:** Not checked.

```php
Event::listen('shop.beforeCreateOrderRecord', function($order) {
    // Set a custom field before the order is created
    $order->custom_reference = ExternalService::generateReference();
});
```

### shop.beforeUpdateOrderRecord

Fires before an existing order record is updated.

| Parameter | Type | Description |
| --- | --- | --- |
| `$order` | Order | The order model about to be updated |

**Return:** Not checked.

```php
Event::listen('shop.beforeUpdateOrderRecord', function($order) {
    // Log changes to specific fields
    if ($order->isDirty('shipping_address_line1')) {
        Log::info('Shipping address changed for order #' . $order->id);
    }
});
```

### shop.newOrder

Fires after a new order has been successfully placed and saved. Use this for post-order processing such as syncing with external systems.

| Parameter | Type | Description |
| --- | --- | --- |
| `$order` | Order | The newly created order |

**Return:** Not checked.

```php
Event::listen('shop.newOrder', function($order) {
    // Sync to external ERP system
    ErpService::createOrder([
        'reference' => $order->id,
        'total' => $order->total,
        'items' => $order->items->toArray()
    ]);
});
```

### shop.order.orderPaid

Fires when an order is marked as paid (payment has been confirmed).

| Parameter | Type | Description |
| --- | --- | --- |
| `$order` | Order | The order that was paid |

**Return:** Not checked.

```php
Event::listen('shop.order.orderPaid', function($order) {
    // Trigger fulfillment workflow
    FulfillmentService::enqueue($order);
});
```

### shop.order.getNotificationVars

Fires when building template variables for order notification emails. Return an array of additional variables to merge into the email template data.

| Parameter | Type | Description |
| --- | --- | --- |
| `$order` | Order | The order model |

**Return:** Array of variables to merge into the notification template.

```php
Event::listen('shop.order.getNotificationVars', function($order) {
    return [
        'estimated_delivery' => ShippingCalculator::estimateDelivery($order),
        'loyalty_points_earned' => LoyaltyService::calculatePoints($order)
    ];
});
```

### shop.order.itemDisplayDetails

Fires when rendering order item details, providing an opportunity to append extra information to the item display.

| Parameter | Type | Description |
| --- | --- | --- |
| `$item` | OrderItem | The order item being displayed |
| `$plainText` | boolean | Whether the output is plain text (true) or HTML (false) |

**Return:** Array of detail strings to append to the item display.

```php
Event::listen('shop.order.itemDisplayDetails', function($item, $plainText) {
    $details = [];

    if ($item->product->is_gift_wrapped) {
        $details[] = $plainText ? 'Gift wrapped' : '<em>Gift wrapped</em>';
    }

    return $details;
});
```

## Order Status Events

### shop.beforeUpdateOrderStatus

Fires before an order's status is changed. Return `false` to prevent the status update.

| Parameter | Type | Description |
| --- | --- | --- |
| `$record` | OrderStatusLog | The status log record being created |
| `$order` | Order | The order model |
| `$statusId` | integer | The new status ID |
| `$previousStatus` | OrderStatus | The previous status |

**Return:** Return `false` to cancel the status change.

```php
Event::listen('shop.beforeUpdateOrderStatus', function($record, $order, $statusId, $previousStatus) {
    // Prevent transitioning to "Shipped" without a tracking code
    $shippedStatus = OrderStatus::where('code', 'shipped')->first();
    if ($statusId == $shippedStatus?->id && $order->tracking_codes->isEmpty()) {
        throw new ApplicationException('Cannot mark as shipped without a tracking code.');
    }
});
```

### shop.order.stockChanged

Fires before stock is decreased when an order is marked as paid. Return `false` to prevent stock reduction, useful if you manage inventory externally.

| Parameter | Type | Description |
| --- | --- | --- |
| `$order` | Order | The order model |
| `$statusPaid` | boolean | Whether the new status represents a paid state |

**Return:** Return `false` to prevent stock from being decreased.

```php
Event::listen('shop.order.stockChanged', function($order, $statusPaid) {
    // Handle stock externally via warehouse API
    WarehouseApi::decreaseStock($order->items);

    // Prevent Meloncart from also decreasing stock
    return false;
});
```

### shop.order.updateStatus

Fires after an order's status has been successfully updated.

| Parameter | Type | Description |
| --- | --- | --- |
| `$order` | Order | The order model |
| `$status` | OrderStatus | The new status |
| `$previousStatus` | OrderStatus | The previous status |

**Return:** Not checked.

```php
Event::listen('shop.order.updateStatus', function($order, $status, $previousStatus) {
    // Notify external systems of status change
    WebhookService::fire('order.status_changed', [
        'order_id' => $order->id,
        'from' => $previousStatus->code,
        'to' => $status->code
    ]);
});
```

### shop.beforeOrderInternalStatusNotification

Fires before sending an internal status notification email to administrators. Return `false` to prevent the notification.

| Parameter | Type | Description |
| --- | --- | --- |
| `$order` | Order | The order model |
| `$status` | OrderStatus | The status triggering the notification |

**Return:** Return `false` to suppress the admin notification email.

```php
Event::listen('shop.beforeOrderInternalStatusNotification', function($order, $status) {
    // Suppress internal notifications for test orders
    if ($order->billing_email === 'test@example.com') {
        return false;
    }
});
```

## Cart Events

### shop.cart.beforeAddProduct

Fires before a product is added to the cart.

| Parameter | Type | Description |
| --- | --- | --- |
| `$product` | Product | The product being added |
| `$options` | array | Cart options including quantity, selected options, extras |

**Return:** Not checked.

```php
Event::listen('shop.cart.beforeAddProduct', function($product, $options) {
    // Enforce purchase limits
    $maxQty = $product->max_purchase_quantity;
    if ($maxQty && $options['quantity'] > $maxQty) {
        throw new ApplicationException(
            "Maximum purchase quantity for this product is {$maxQty}."
        );
    }
});
```

### shop.cart.addProduct

Fires after a product has been successfully added to the cart.

| Parameter | Type | Description |
| --- | --- | --- |
| `$product` | Product | The product that was added |
| `$options` | array | Cart options including quantity, selected options, extras |

**Return:** Not checked.

```php
Event::listen('shop.cart.addProduct', function($product, $options) {
    // Track add-to-cart analytics
    Analytics::track('product_added_to_cart', [
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => $options['quantity']
    ]);
});
```

### shop.cart.processCustomData

Fires when a product is added to the cart, allowing you to modify or inject custom data that is stored with the cart item. The custom data array is passed by reference.

| Parameter | Type | Description |
| --- | --- | --- |
| `&$customData` | array | Custom data array (passed by reference) |
| `$product` | Product | The product being added |
| `$options` | array | Cart options |

**Return:** Not checked. Modify `$customData` directly by reference.

```php
Event::listen('shop.cart.processCustomData', function(&$customData, $product, $options) {
    // Attach a gift message to the cart item
    if ($message = post('gift_message')) {
        $customData['gift_message'] = $message;
    }
});
```

### shop.cart.beforeRemoveItem

Fires before a cart item is removed.

| Parameter | Type | Description |
| --- | --- | --- |
| `$itemKey` | string | The unique key of the cart item being removed |
| `$cartName` | string | Name of the cart |

**Return:** Not checked.

```php
Event::listen('shop.cart.beforeRemoveItem', function($itemKey, $cartName) {
    Log::info("Removing item {$itemKey} from cart {$cartName}");
});
```

### shop.cart.afterRemoveItem

Fires after a cart item has been removed.

| Parameter | Type | Description |
| --- | --- | --- |
| `$itemKey` | string | The unique key of the cart item that was removed |
| `$cartName` | string | Name of the cart |

**Return:** Not checked.

```php
Event::listen('shop.cart.afterRemoveItem', function($itemKey, $cartName) {
    Analytics::track('product_removed_from_cart', [
        'item_key' => $itemKey
    ]);
});
```

### shop.cart.beforeSetQuantity

Fires before a cart item's quantity is changed.

| Parameter | Type | Description |
| --- | --- | --- |
| `$itemKey` | string | The unique key of the cart item |
| `$quantity` | integer | The new quantity |
| `$cartName` | string | Name of the cart |

**Return:** Not checked.

```php
Event::listen('shop.cart.beforeSetQuantity', function($itemKey, $quantity, $cartName) {
    if ($quantity > 100) {
        throw new ApplicationException('Maximum quantity per item is 100.');
    }
});
```

### shop.cart.setQuantity

Fires after a cart item's quantity has been changed.

| Parameter | Type | Description |
| --- | --- | --- |
| `$itemKey` | string | The unique key of the cart item |
| `$quantity` | integer | The new quantity |
| `$cartName` | string | Name of the cart |

**Return:** Not checked.

```php
Event::listen('shop.cart.setQuantity', function($itemKey, $quantity, $cartName) {
    Analytics::track('cart_quantity_changed', [
        'item_key' => $itemKey,
        'quantity' => $quantity
    ]);
});
```

### shop.cart.getPrice

Fires when a cart item price is calculated for display. The price is passed by reference, allowing you to override it.

| Parameter | Type | Description |
| --- | --- | --- |
| `$item` | CartItem | The cart item |
| `&$price` | integer | The current price in cents (passed by reference) |

**Return:** Not checked. Modify `$price` directly by reference.

```php
Event::listen('shop.cart.getPrice', function($item, &$price) {
    // Apply a member-only discount
    $user = Auth::getUser();
    if ($user && $user->inGroup('vip')) {
        $price = (int) ($price * 0.9); // 10% VIP discount
    }
});
```

### shop.cart.afterEvaluatePriceRules

Fires after all price rules have been evaluated on the cart.

| Parameter | Type | Description |
| --- | --- | --- |
| `$result` | mixed | The price rule evaluation result |
| `$cartName` | string | Name of the cart |

**Return:** Not checked.

```php
Event::listen('shop.cart.afterEvaluatePriceRules', function($result, $cartName) {
    // Log discount totals for analytics
    Log::debug('Price rules evaluated for cart: ' . $cartName);
});
```

## Product Events

### shop.product.getOriginalPrice

Fires when a product's price is calculated for display. The price is passed by reference, allowing you to override it.

| Parameter | Type | Description |
| --- | --- | --- |
| `&$price` | integer | The current price in cents (passed by reference) |
| `$product` | Product | The product model |
| `$quantity` | integer | The quantity being priced |
| `$userGroupId` | integer\|null | The user group ID for group-based pricing |

**Return:** Not checked. Modify `$price` directly by reference.

```php
Event::listen('shop.product.getOriginalPrice', function(&$price, $product, $quantity, $userGroupId) {
    // Apply a dynamic pricing algorithm
    if ($product->categories->contains('code', 'clearance')) {
        $price = (int) ($price * 0.5); // 50% off clearance items
    }
});
```

### shop.product.getExtraOriginalPrice

Fires when a product extra's price is calculated for display. The price is passed by reference.

| Parameter | Type | Description |
| --- | --- | --- |
| `&$price` | integer | The current extra price in cents (passed by reference) |
| `$extra` | ProductExtra | The product extra model |
| `$product` | Product | The parent product model |

**Return:** Not checked. Modify `$price` directly by reference.

```php
Event::listen('shop.product.getExtraOriginalPrice', function(&$price, $extra, $product) {
    // Make extras free for VIP users
    $user = Auth::getUser();
    if ($user && $user->inGroup('vip')) {
        $price = 0;
    }
});
```

### shop.productOutOfStock

Fires when a product goes out of stock after inventory is decreased.

| Parameter | Type | Description |
| --- | --- | --- |
| `$product` | Product | The product that is now out of stock |

**Return:** Not checked.

```php
Event::listen('shop.productOutOfStock', function($product) {
    // Notify the merchandising team
    Notification::send($merchandisingTeam, new ProductOutOfStockNotification($product));
});
```

### shop.variantOutOfStock

Fires when a product variant goes out of stock after inventory is decreased.

| Parameter | Type | Description |
| --- | --- | --- |
| `$variant` | ProductVariant | The variant that is now out of stock |

**Return:** Not checked.

```php
Event::listen('shop.variantOutOfStock', function($variant) {
    Log::warning("Variant out of stock: {$variant->product->name} - {$variant->sku}");
});
```

### shop.product.getNotificationVars

Fires when building template variables for product notification emails (such as low stock alerts). Return an array of additional variables.

| Parameter | Type | Description |
| --- | --- | --- |
| `$product` | Product | The product model |

**Return:** Array of variables to merge into the notification template.

```php
Event::listen('shop.product.getNotificationVars', function($product) {
    return [
        'reorder_url' => SupplierService::getReorderUrl($product->sku),
        'supplier_name' => $product->supplier?->name
    ];
});
```

## Checkout Events

### shop.checkout.beforeSetCouponCode

Fires before a coupon code is applied to the checkout. The code is passed by reference, allowing you to modify it.

| Parameter | Type | Description |
| --- | --- | --- |
| `&$code` | string | The coupon code being applied (passed by reference) |

**Return:** Not checked. Modify `$code` directly by reference.

```php
Event::listen('shop.checkout.beforeSetCouponCode', function(&$code) {
    // Normalize coupon codes to uppercase
    $code = strtoupper(trim($code));
});
```

## Backend UI Events

These events are fired in the admin panel and can be used to extend backend pages.

### shop.orders.extendPreviewTabs

Add custom tabs to the order preview page in the admin panel. Return an array mapping tab names to partial paths.

**Return:** Array of `['Tab Name' => '~/path/to/partial.php']`.

```php
Event::listen('shop.orders.extendPreviewTabs', function() {
    return [
        'Shipping Labels' => '~/plugins/vendor/shipping/controllers/labels/_order_tab.php'
    ];
});
```

### shop.products.extendPreviewTabs

Add custom tabs to the product preview page in the admin panel.

**Return:** Array of `['Tab Name' => '~/path/to/partial.php']`.

```php
Event::listen('shop.products.extendPreviewTabs', function() {
    return [
        'Analytics' => '~/plugins/vendor/analytics/controllers/products/_analytics_tab.php'
    ];
});
```

### shop.orders.extendListToolbar

Add custom buttons or controls to the orders list toolbar in the admin panel. Return HTML to insert into the toolbar.

```php
Event::listen('shop.orders.extendListToolbar', function($controller) {
    return '<a href="/export-orders" class="btn btn-sm btn-secondary ms-3">Export All</a>';
});
```

### shop.products.extendListToolbar

Add custom buttons or controls to the products list toolbar.

```php
Event::listen('shop.products.extendListToolbar', function($controller) {
    return '<a href="/sync-products" class="btn btn-sm btn-secondary ms-3">Sync Inventory</a>';
});
```

### shop.categories.extendListToolbar

Add custom buttons or controls to the categories list toolbar.

```php
Event::listen('shop.categories.extendListToolbar', function($controller) {
    return '<a href="/rebuild-tree" class="btn btn-sm btn-secondary ms-3">Rebuild Tree</a>';
});
```

## Event Reference

### Summary Table

| Event | Parameters | Cancellable | Category |
| --- | --- | --- | --- |
| `shop.beforePlaceOrder` | `$cartName` | No | Order |
| `shop.placeOrderError` | `$message`, `$cartName` | No | Order |
| `shop.beforeCreateOrderRecord` | `$order` | No | Order |
| `shop.beforeUpdateOrderRecord` | `$order` | No | Order |
| `shop.newOrder` | `$order` | No | Order |
| `shop.order.orderPaid` | `$order` | No | Order |
| `shop.order.getNotificationVars` | `$order` | No | Order |
| `shop.order.itemDisplayDetails` | `$item`, `$plainText` | No | Order |
| `shop.beforeUpdateOrderStatus` | `$record`, `$order`, `$statusId`, `$prevStatus` | **Yes** | Status |
| `shop.order.stockChanged` | `$order`, `$statusPaid` | **Yes** | Status |
| `shop.order.updateStatus` | `$order`, `$status`, `$prevStatus` | No | Status |
| `shop.beforeOrderInternalStatusNotification` | `$order`, `$status` | **Yes** | Status |
| `shop.cart.beforeAddProduct` | `$product`, `$options` | No | Cart |
| `shop.cart.addProduct` | `$product`, `$options` | No | Cart |
| `shop.cart.processCustomData` | `&$customData`, `$product`, `$options` | No | Cart |
| `shop.cart.beforeRemoveItem` | `$itemKey`, `$cartName` | No | Cart |
| `shop.cart.afterRemoveItem` | `$itemKey`, `$cartName` | No | Cart |
| `shop.cart.beforeSetQuantity` | `$itemKey`, `$quantity`, `$cartName` | No | Cart |
| `shop.cart.setQuantity` | `$itemKey`, `$quantity`, `$cartName` | No | Cart |
| `shop.cart.getPrice` | `$item`, `&$price` | No | Cart |
| `shop.cart.afterEvaluatePriceRules` | `$result`, `$cartName` | No | Cart |
| `shop.product.getOriginalPrice` | `&$price`, `$product`, `$quantity`, `$groupId` | No | Product |
| `shop.product.getExtraOriginalPrice` | `&$price`, `$extra`, `$product` | No | Product |
| `shop.productOutOfStock` | `$product` | No | Product |
| `shop.variantOutOfStock` | `$variant` | No | Product |
| `shop.product.getNotificationVars` | `$product` | No | Product |
| `shop.checkout.beforeSetCouponCode` | `&$code` | No | Checkout |
| `shop.orders.extendPreviewTabs` | -- | No | Backend |
| `shop.products.extendPreviewTabs` | -- | No | Backend |
| `shop.orders.extendListToolbar` | `$controller` | No | Backend |
| `shop.products.extendListToolbar` | `$controller` | No | Backend |
| `shop.categories.extendListToolbar` | `$controller` | No | Backend |

::: tip
Parameters prefixed with `&` are passed by reference and can be modified directly in your event listener.
:::

::: warning
Events marked as **Cancellable** will prevent the default behavior when you return `false`. Use these carefully to avoid disrupting the normal order workflow.
:::

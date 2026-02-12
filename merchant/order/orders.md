---
subtitle: View, process and manage customer orders.
---
# Orders

Orders are created when customers complete the checkout process on your storefront. Each order captures a snapshot of the purchased items, pricing, customer addresses, payment and shipping selections, and tax calculations. Navigate to **Shop → Orders** to manage your orders.

## Order List

The order list displays all orders with their key details: order number, customer name, status, total, and date. The list supports several features for efficient order management:

### Status Tab Filters

The order list includes tabs across the top that filter orders by status. Click a status tab to show only orders in that status. This makes it easy to focus on orders that need attention — for example, viewing only new orders that need processing or paid orders that need fulfillment.

### Searching and Filtering

Use the search bar to find orders by order number, customer name, or email address. Column filters allow additional narrowing by date range, status, or other criteria.

### Bulk Operations

Select multiple orders using the checkboxes to perform bulk actions:

- **Delete** — Soft-deletes the selected orders, removing them from the active list while preserving them for recovery.
- **Restore** — Restores previously soft-deleted orders back to the active list.
- **Change Status** — Apply a status transition to multiple orders at once. When orders have different current statuses, only transitions that are valid for all selected orders are available.

### Import and Export

Use the **Import** and **Export** buttons on the order list toolbar to work with orders in CSV format. Export is useful for generating reports or feeding data into external systems.

## Order Details

Click an order to view its full details. The order form is organized into several sections:

### Order Items

The items section lists every product in the order, showing the product name, options selected, extras added, quantity, unit price, discount, and line total. Each item displays its full description including variant information and any bundle components.

You can manage order items directly:

- **Add Item** — Click to add a new product to the order. Select a product, choose options and extras, set the quantity, and the system calculates pricing automatically.
- **Edit Item** — Click an existing item to modify its quantity, price, or other details.
- **Remove Item** — Delete an item from the order.

::: tip
When adding or editing items, the order totals are recalculated automatically, including taxes and any applicable discounts.
:::

### Addresses

The order stores separate billing and shipping addresses:

- **Billing Address** — The customer's billing name, company, street address, city, ZIP code, state, and country. Also includes email and phone number.
- **Shipping Address** — The delivery destination, with the same fields as the billing address.

A **Copy Billing Address** button copies the billing address to the shipping address fields. When the billing and shipping countries differ, the state field is cleared since states are country-specific.

### Order Totals

The totals section shows the financial breakdown:

- **Subtotal** — The sum of all item prices after per-item discounts.
- **Discount** — The total discount amount from cart price rules or coupons.
- **Taxes** — An itemized breakdown of all applicable taxes (sales taxes and shipping taxes, grouped by tax name).
- **Shipping** — The shipping cost, including any handling fees.
- **Total** — The final amount charged to the customer.

### Customer

The order is linked to a customer account. You can view the associated customer or change the customer assignment. When a customer is selected, their billing address information can be automatically populated into the order.

### Notes

Internal notes can be added to an order for team communication. Notes are timestamped and attributed to the backend user who created them. Some notes can be marked as visible to the customer, allowing them to appear on the customer's order detail page on the storefront.

### Tracking Codes

When an order is shipped, you can add one or more tracking codes. Each tracking code is recorded with a timestamp. The order is automatically considered "shipped" once at least one tracking code has been added.

Tracking information can be included in status notification emails sent to the customer.

## Order Statuses

Every order has a status that reflects its current stage in your fulfillment workflow. Statuses are managed under **Settings → Order Routes**.

### Default Statuses

Meloncart creates two essential statuses during installation:

- **New** — Assigned to orders when they are first placed.
- **Paid** — Assigned automatically when payment is confirmed.

You can create additional statuses to match your workflow, such as "Processing", "Shipped", "Delivered", "Cancelled", or "Refunded".

### Status Properties

Each status has the following settings:

- **Name** — The display name of the status.
- **Code** — A unique internal identifier.
- **Color** — A background color used to visually distinguish the status in the order list and detail views.
- **Notify Customer** — When enabled, changing an order to this status sends a notification email to the customer.
- **Notify Recipient** — When enabled, notification emails are also sent to backend administrators.
- **Customer Message Template** — An optional custom mail template for the customer notification. If not set, the default `shop:order_status_update` template is used.
- **System Message Template** — An optional custom mail template for the admin notification. If not set, the default `shop:order_status_update_internal` template is used.
- **Admin Groups** — Backend user groups that receive notifications when an order enters this status.

### Status Transitions

Transitions define the allowed paths between statuses and control which backend users can perform each transition. Each transition specifies:

- **From Status** — The starting status.
- **To Status** — The destination status.
- **Admin Group** — The backend user group allowed to make this transition.

For example, you might allow your "Warehouse" admin group to transition orders from "Processing" to "Shipped", but only allow "Managers" to transition orders to "Cancelled".

When a backend user views an order, the status dropdown only shows transitions that are valid for the order's current status and the user's admin group membership.

::: warning
If no transitions are defined for a status, backend users with access to that status can transition to any other status. Define transitions to enforce a controlled workflow.
:::

### Changing an Order's Status

To change an order's status, open the order and select the new status from the **Status** dropdown in the status log section. You can optionally add a comment that explains the reason for the status change.

When the status is changed:

1. A status log entry is created, recording the previous status, new status, timestamp, the backend user who made the change, and any comment.
2. If the new status has **Notify Customer** enabled, the customer receives an email notification.
3. If the new status has **Notify Recipient** enabled, the configured admin groups receive a notification.
4. If the new status is "Paid", the order is automatically marked as payment processed and stock levels are decreased.

### Status Log

The status log provides a complete audit trail of all status changes for an order. Each entry shows the status, the date and time of the change, the backend user who made it, and any associated comment.

## Order Lifecycle

A typical order follows this lifecycle:

1. **Customer places order** — The order is created with a "New" status. An invoice is generated in the payment system.
2. **Payment is processed** — When the payment gateway confirms payment, the order status automatically transitions to "Paid". Stock levels are decreased for all items in the order.
3. **Order is fulfilled** — A backend user processes the order, picks and packs the items, and updates the status (e.g., to "Processing" or "Shipped"). Tracking codes are added when the shipment is dispatched.
4. **Customer is notified** — At each status change (if configured), the customer receives an email with the order details and current status.
5. **Order is complete** — The order reaches its final status (e.g., "Delivered" or "Complete").

### Stock and Orders

Stock levels are decreased when an order transitions to the "Paid" status, not when the order is first placed. This means stock is only committed once payment is confirmed.

For more details on how stock interacts with orders, see the [Inventory](../product/inventory) documentation.

## Editing Orders

Backend users can edit most aspects of an existing order:

- Add, remove, or modify order items.
- Change the billing or shipping address.
- Update the shipping method or payment method.
- Override the shipping quote with a manual amount.
- Apply or remove a coupon code.
- Add notes and tracking codes.

When you make changes to an order, the totals are recalculated automatically. The associated invoice is also updated to stay in sync with the order.

::: info
Editing an order does not affect already-processed payments. If the total changes after payment, you may need to handle the difference through a refund or additional charge outside of the order system.
:::

## Soft Delete and Restore

When you delete an order, it is soft-deleted by default. Soft-deleted orders are hidden from the main list but can be restored. Deleted orders appear with a strikethrough style when viewing all orders (including deleted).

To permanently remove an order, use the force delete option. This is irreversible and should only be used for test orders or erroneous entries.

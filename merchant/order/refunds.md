---
subtitle: Process and manage order refunds.
---
# Refunds

Refunds in Meloncart are handled through a combination of order status management, payment gateway processing, and manual stock restoration. This page explains how to process refunds for orders that have been paid.

## Refund Process

### Issuing a Refund via the Payment Gateway

If the order was paid through an online payment method (such as Stripe or PayPal), the refund is processed through the payment gateway's own interface or API. Responsiv.Pay records refund transactions in the payment log, which is accessible through the order's associated invoice.

The specific refund process depends on the payment gateway being used:

- **Stripe** — Refunds can typically be initiated from the Stripe dashboard or through the payment log in Responsiv.Pay.
- **PayPal** — Refunds are managed through the PayPal seller dashboard.
- **Offline methods** — For orders paid via bank transfer or similar methods, refunds are handled outside the system (e.g., manual bank transfer back to the customer).

### Updating Order Status

After processing a refund, update the order's status to reflect the change. If you have created a "Refunded" or "Cancelled" status in your order workflow (under **Settings → Order Routes**), transition the order to that status.

This status change:

1. Creates a log entry documenting the refund.
2. Notifies the customer via email if the status has customer notifications enabled.
3. Provides a clear record in your order history.

::: tip
Consider creating separate statuses for "Partially Refunded" and "Fully Refunded" to distinguish between the two scenarios in your order list.
:::

## Stock Restoration

When an order is refunded or cancelled, stock is **not** automatically restored. Stock levels were decreased when the order was marked as paid, but the reverse does not happen automatically upon refund.

To restore stock after a refund:

1. Open the order in the backend.
2. Edit the relevant order items or adjust the product's stock level directly under **Shop → Products**.
3. Manually increase the **Units in Stock** field on the product (or variant) by the refunded quantity.

::: warning
Always verify stock levels manually after processing a refund. Automatic stock restoration is not performed to prevent inconsistencies in cases where the refunded product has already been consumed, disposed of, or is otherwise not available for resale.
:::

## Partial Refunds

For partial refunds (refunding only some items or a portion of the order total):

1. Process the partial refund amount through the payment gateway.
2. Optionally edit the order to reflect the adjustment — you can modify item quantities, prices, or add a note explaining the partial refund.
3. Update the order status to indicate it has been partially refunded.
4. Restore stock manually for any items being returned.

## Record Keeping

All refund-related activity is tracked through several mechanisms:

- **Status Log** — The order's status log records when the status was changed to a refund-related status, who made the change, and any comment provided.
- **Payment Log** — The invoice's payment log records refund transactions processed through the payment gateway.
- **Order Notes** — Use the notes feature on the order to add any additional context about why the refund was issued.

Together, these records provide a complete audit trail for each refund.

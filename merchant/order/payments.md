---
subtitle: Configure payment methods and track payment status.
---
# Payments

Payment processing in Meloncart is handled by the **Responsiv.Pay** plugin. This plugin provides the payment gateway infrastructure, invoice management, and payment method configuration. Meloncart integrates with it to connect orders to payments seamlessly.

## Payment Methods

Payment methods are configured under **Settings → Payment Methods** (provided by the Responsiv.Pay plugin). Each payment method represents a way customers can pay for their orders — such as credit card via Stripe, PayPal, bank transfer, or cash on delivery.

### Setting Up a Payment Method

Click **New Payment Method** to add one. Each payment method has:

- **Name** — The display name shown to customers at checkout (e.g., "Credit Card", "PayPal").
- **Driver** — The payment gateway driver that handles the transaction (e.g., Stripe, PayPal, offline).
- **Enabled** — Whether the method is available to customers.
- **Configuration** — Driver-specific settings such as API keys, webhook URLs, and mode (test/live).

### Order-Specific Settings

Meloncart extends payment method drivers with additional settings:

#### For Offline Payment Methods

Payment methods without an online payment form (such as bank transfer, cash on delivery, or invoice payment) have these additional settings:

- **Order Start Status** — The order status to assign when a customer selects this payment method at checkout. This allows you to route orders differently based on how the customer pays. For example, bank transfer orders might start in a "Awaiting Payment" status.
- **Suppress Order Notifications** — When enabled, the standard "new order" notification email is not sent for orders using this payment method. This is useful when you want to handle notification for certain payment types manually.

#### For Online Payment Methods

Payment methods with an online payment form (such as Stripe or PayPal) have:

- **Order Status** — The status to assign to the order upon successful payment. This defaults to "Paid" but can be changed to match your workflow.

## Payment Processing Flow

### Standard Flow

1. **Customer selects payment method** — During checkout, the customer chooses from available payment methods.
2. **Order is created** — When the customer places the order, Meloncart creates an order record and an associated invoice in the Responsiv.Pay system.
3. **Payment is processed** — For online payment methods, the customer is redirected to a payment page (or a payment form is displayed inline). For offline methods, the order is created immediately with the configured start status.
4. **Payment confirmation** — When the payment gateway confirms the transaction, the invoice is marked as paid.
5. **Order status updates** — Meloncart detects the paid invoice and automatically:
   - Marks the order as payment processed (recording the timestamp).
   - Transitions the order to the "Paid" status (or the configured status for that payment method).
   - Sends status notification emails if configured.
   - Decreases stock levels for all items in the order.

### Invoices

Each order has an associated invoice managed by Responsiv.Pay. The invoice mirrors the order's items, totals, and payment information. When you edit an order in the backend (adding or removing items, changing the shipping method, etc.), the invoice is automatically synchronized to reflect the current order state.

Invoices track:

- **Items** — Each order item is linked to a corresponding invoice item.
- **Total** — The total amount due.
- **Payment Method** — The selected payment gateway.
- **Payment Status** — Whether the invoice has been paid.
- **Payment Log** — A record of all payment attempts and transactions.

## Payment Status

An order's payment status is determined by whether the `payment_processed_at` timestamp has been set:

- **Unpaid** — The order has no payment processed timestamp. The customer may not have completed payment, or the payment gateway has not yet confirmed the transaction.
- **Paid** — The order has a payment processed timestamp, indicating successful payment.

::: info
The payment status is set automatically when the payment gateway confirms the transaction. You generally do not need to manage this manually. However, for offline payment methods (bank transfer, etc.), transitioning the order to the "Paid" status in the backend will mark the payment as processed.
:::

## Payment Log

Each order's payment history can be viewed through the associated invoice. The payment log records all interactions with the payment gateway, including successful charges, failed attempts, and refund transactions. This is useful for troubleshooting payment issues.

## Multiple Payment Methods

Your store can have multiple active payment methods simultaneously. At checkout, customers see all enabled payment methods that are applicable to their order. The Responsiv.Pay plugin handles the routing to the correct gateway based on the customer's selection.

::: tip
For stores that sell both physical and digital products, you can set up different payment methods with different configurations. All enabled methods appear at checkout regardless of what is in the cart.
:::

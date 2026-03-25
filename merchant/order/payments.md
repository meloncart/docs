---
subtitle: Configure payment methods and track payment status.
---
# Payments

Payment processing in Meloncart is handled by the **[Responsiv.Pay](https://octobercms.com/plugin/responsiv-pay)** plugin. This plugin provides the payment gateway infrastructure, invoice management, and payment method configuration. Meloncart integrates with it to connect orders to payments seamlessly.

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

### Invoice Templates

Invoice templates control the layout and content of printed invoices. Navigate to **Settings → Invoice Templates** (provided by the Responsiv.Pay plugin) to manage your templates. A default template is created during installation.

Each template has:

- **Name** — A descriptive name for the template.
- **Code** — A unique identifier.
- **Is Default** — Whether this is the default template used for new invoices.

Templates use the same syntax field system as [shipping labels](./shipping-labels) and [packing slips](./packing-slips). The **HTML** and **CSS** tabs contain the template markup and styles. Syntax fields embedded in the HTML (such as `{text name="company_name"}`) are extracted on save and appear as editable form fields in the **Invoice** tab.

The default template includes:

- **Company logo** — Uploaded via a file upload syntax field.
- **Company name and address** — Editable text fields for your business details.
- **Company registration number** — For displaying ABN, VAT, or other registration numbers.
- **Customer details** — Populated from the invoice's billing address.
- **Invoice items table** — Description, quantity, unit price, and total for each line item.
- **Totals** — Subtotal, tax, and total amount due.

#### Printing an Invoice

From an order's preview page, click **View Invoice** to navigate to the invoice preview. The invoice preview page displays the rendered invoice and includes a **Print Invoice** button that opens your browser's print dialog.

#### Selecting a Template

Each invoice has a template dropdown where you can select which template to use. If left as "Use Default", the template marked as default will be used. You can create multiple templates for different purposes (e.g., a formal template for business clients and a simpler one for retail customers).

## Payment Status

An order's payment status is determined by whether the `payment_processed_at` timestamp has been set:

- **Unpaid** — The order has no payment processed timestamp. The customer may not have completed payment, or the payment gateway has not yet confirmed the transaction.
- **Paid** — The order has a payment processed timestamp, indicating successful payment.

::: info
The payment status is set automatically when the payment gateway confirms the transaction. You generally do not need to manage this manually. However, for offline payment methods (bank transfer, etc.), transitioning the order to the "Paid" status in the backend will mark the payment as processed.
:::

### Pending Payments

Some payment gateways (such as PayPal) may not confirm a transaction immediately. When this occurs, the invoice status is set to **Approved**, indicating the customer has submitted their payment but final confirmation is still pending.

While an invoice is in the Approved state:

- The payment page displays a "Your payment is being processed" message instead of showing payment methods, preventing the customer from paying twice.
- When the customer revisits the payment page, the system automatically polls the payment gateway to check if the payment has since been confirmed. If it has, the invoice is marked as paid immediately.
- If the gateway supports webhooks, the payment will also be confirmed asynchronously when the gateway sends a completion notification.

::: tip
If a payment remains in the Approved state for an extended period, you can check the payment log on the associated invoice for details about the gateway's response. The payment gateway's dashboard (e.g., PayPal or Stripe) will have the definitive status of the transaction.
:::

## Store Credit

Store credit allows customers to apply a balance toward their order total at checkout. Credit is managed through the Responsiv.Pay plugin's credit note system, which uses a simple ledger model: credit notes (refunds, adjustments, promotions) increase the balance, and debit notes decrease it. The customer's available balance is the sum of all credits minus the sum of all debits.

### Enabling Store Credit

Store credit must be enabled in the Responsiv.Pay plugin settings. Navigate to **Settings → Payment Settings** and enable the **Store Credit** option. Once enabled, the checkout page will display the customer's available balance and an option to apply it.

### How It Works at Checkout

When a logged-in customer has store credit available, they can apply it to their order during checkout. The applied amount is the lesser of their available balance and the order total.

- **Partial coverage** — If the credit doesn't cover the full order, the remaining amount is charged through the selected payment gateway. For example, a $100 order with $20 credit applied will charge $80 to the payment gateway.
- **Full coverage** — If the credit covers the entire order total, the order is marked as paid immediately without involving the payment gateway. The customer is redirected to the receipt page after placing the order.

### Viewing Credit on Orders

When store credit has been applied to an order, the credit amount is visible on the order's associated invoice. The invoice shows:

- **Total** — The full order amount before credit.
- **Credit Applied** — The store credit amount deducted.
- **Amount Due** — The outstanding balance sent to the payment gateway.

### Issuing Store Credit

Store credit can be issued to customers from the admin panel under the user's credit tab. Each credit note records an amount, currency, reason, and type (refund, adjustment, or promotion). The customer's balance updates immediately.

### Credit Notes on Invoices

When credit is applied to an order, a **debit** credit note is created and linked to the invoice. This provides a clear audit trail — you can see exactly which invoice each credit deduction was applied to. If an order is cancelled, a corresponding **credit** note can be issued to restore the customer's balance.

## Payment Log

Each order's payment history can be viewed through the associated invoice. The payment log records all interactions with the payment gateway, including successful charges, failed attempts, and refund transactions. This is useful for troubleshooting payment issues.

## Multiple Payment Methods

Your store can have multiple active payment methods simultaneously. At checkout, customers see all enabled payment methods that are applicable to their order. The Responsiv.Pay plugin handles the routing to the correct gateway based on the customer's selection.

::: tip
For stores that sell both physical and digital products, you can set up different payment methods with different configurations. All enabled methods appear at checkout regardless of what is in the cart.
:::

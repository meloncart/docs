---
subtitle: Manage store credit balances and credit notes.
---
# Store Credit

Store credit allows customers to accumulate a balance that can be applied toward future purchases. It is managed through the Responsiv.Pay plugin's credit note system, which uses a simple ledger model: credit notes increase the balance and debit notes decrease it. The customer's available balance is always the sum of all credits minus the sum of all debits.

## Enabling Store Credit

Store credit is disabled by default. To enable it, navigate to **Settings → Payment Settings** and enable the **Store Credit** option. Once enabled:

- The checkout page displays the customer's available balance and an option to apply it.
- The "Credit" tab appears on customer records in the admin panel.
- The refund popup includes an "Issue store credit" option.

When disabled, all credit-related UI is hidden. The underlying credit note data is preserved — disabling the feature does not delete existing balances.

## How It Works at Checkout

When a logged-in customer has store credit available, they can apply it to their order during checkout. The applied amount is the lesser of their available balance and the order total.

- **Partial coverage** — If the credit doesn't cover the full order, the remaining amount is charged through the selected payment gateway. For example, a $100 order with $20 credit applied will charge $80 to the payment gateway.
- **Full coverage** — If the credit covers the entire order total, the order is marked as paid immediately without involving the payment gateway. The customer is redirected to the receipt page after placing the order.

::: tip
Store credit requires a customer account. Guest checkout customers cannot use store credit.
:::

## Viewing Credit on Orders

When store credit has been applied to an order, the credit amount is visible in several places:

- **Order preview (admin)** — The scoreboard shows the credit amount alongside tax and shipping in the Total item.
- **Invoice preview (admin)** — The Credit Notes tab lists the debit note that was applied, with the amount and a link to the invoice.
- **Order detail (customer)** — The order items page shows "Store credit applied" and the reduced "Amount due" below the subtotal.

The order and invoice both display:

- **Total** — The full order amount before credit.
- **Credit Applied** — The store credit amount deducted.
- **Amount Due** — The outstanding balance sent to the payment gateway.

## Issuing Store Credit

Store credit can be issued to customers from the admin panel. Navigate to a customer's record and open the **Credit** tab.

### Adjusting a Customer's Balance

Click the **Adjust Credit** button to open the credit adjustment form:

- **Amount** — The credit amount to add (in display currency, e.g. dollars not cents).
- **Currency** — The currency for this credit note.
- **Reason** — A required description of why the credit is being issued (e.g., "Compensation for delayed shipment").

The adjustment is recorded as a credit note with the admin user who made the change. The customer's balance updates immediately.

### Credit History

The Credit tab shows a complete ledger of all credit notes for the customer:

| Column | Description |
|--------|-------------|
| **Type** | Refund, Adjustment, Debit, or Promotion |
| **Reason** | Why the credit was issued or spent |
| **Amount** | The credit note amount |
| **Issued** | When the note was created |

Debit entries represent credit that was spent at checkout. Each debit is linked to the invoice it was applied to.

## Refunding to Store Credit

When processing a refund through the **Mark Refunded** button on an invoice, you can optionally issue the refund as store credit instead of (or in addition to) refunding through the payment gateway.

The refund popup includes:

- **Issue store credit to customer** — Check this to create a credit note for the refund amount.
- **Refund Amount** — Defaults to the invoice total. Adjust for partial refunds.

When checked, a **refund** credit note is created and linked to the invoice, increasing the customer's balance by the specified amount. The customer can then apply this balance to future orders.

::: info
The "Issue store credit" option only appears when store credit is enabled in payment settings. For bulk refunds (multiple invoices selected from the list), store credit is not issued — only single-invoice refunds support this option.
:::

See [Refunds](./refunds) for general refund processing information.

## Credit Notes on Invoices

When credit is applied to an order, a **debit** credit note is created and linked to the invoice. This provides a clear audit trail — you can see exactly which invoice each credit deduction was applied to.

The invoice preview in the admin panel shows a **Credit Notes** tab when any credit notes are linked to that invoice. This includes both:

- **Debit notes** — Credit spent on this invoice at checkout.
- **Refund notes** — Credit issued back to the customer when the invoice was refunded.

## Multi-Currency

Store credit is currency-specific. A customer can have balances in multiple currencies (e.g., $10 USD and $8 EUR from orders on different storefronts), but credit in one currency cannot be applied to an order in another currency. The checkout only offers the credit option when the customer has a balance in the order's currency.

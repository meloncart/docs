---
subtitle: Invoice and InvoiceItem model reference (Responsiv.Pay plugin).
---
# Invoice Models

This reference documents all Twig-accessible properties and methods for invoice-related models. All prices are stored as integers in **base currency units (cents)** — use the `|currency` filter for display.

Invoices are **accounting ledgers** — they are designed for manual entry and administrative overrides. They can be created manually or generated from orders. Unlike orders, invoices use a simplified pricing model: discounts are stored as line-level totals (like Xero), not per-unit values, and there are no tax-inclusive/exclusive discount variants. This keeps the invoice straightforward for bookkeeping purposes.

For the computed order model with price rules and per-unit tax variants, see [Order Models](./order).

## Invoice

The `Invoice` model represents a billable document with line items, tax, and payment tracking.

### Core Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Primary key |
| `hash` | `string` | Unique lookup hash |
| `invoice_number` | `string` | Formatted invoice number (with prefix) |
| `user_ip` | `string` | Customer IP address at creation |
| `currency_code` | `string` | Three-letter currency code (locked at creation) |
| `is_throwaway` | `bool` | Temporary invoice (not yet finalized) |
| `invoiced_at` | `Carbon` | Invoice date (`sent_at` or `created_at`) |
| `sent_at` | `Carbon\|null` | When invoice was sent |
| `due_at` | `Carbon\|null` | Payment due date |
| `created_at` | `Carbon` | Creation date |
| `updated_at` | `Carbon` | Last update date |

### Financial Properties

All prices are stored as integers in **base currency units (cents)**.

| Property | Type | Description |
|----------|------|-------------|
| `subtotal` | `int` | Items subtotal after discounts: `sum(qty × price - discount)` |
| `original_subtotal` | `int` | Pre-discount subtotal: `subtotal + discount` |
| `final_subtotal` | `int` | Display subtotal. Tax-inclusive: `subtotal`. Tax-exclusive: `subtotal + tax` |
| `discount` | `int` | Total discount across all items (excluding tax) |
| `discount_tax` | `int` | Tax portion of the total discount |
| `final_discount` | `int` | Total discount with tax: `discount + discount_tax` |
| `tax` | `int` | Total sales tax (gross, before discount adjustment) |
| `total_tax` | `int` | Net tax: `tax - discount_tax` |
| `total` | `int` | Final invoice total: `final_subtotal` |
| `credit_applied` | `int` | Store credit applied to this invoice |
| `amount_due` | `int` | Outstanding amount after credit: `max(0, total - credit_applied)` |
| `taxes` | `array` | Breakdown of tax rates applied |

### Tax Properties

| Property | Type | Description |
|----------|------|-------------|
| `is_tax_exempt` | `bool` | Whether the invoice is tax exempt |
| `prices_include_tax` | `bool` | Whether prices were entered with tax included |

The tax breakdown array contains objects with `name` (tax class name) and `total` (tax amount in cents):

```twig
{% for tax in invoice.taxes %}
    <tr>
        <td>{{ tax.name }}</td>
        <td>{{ tax.total|currency({ in: invoice.currency_code }) }}</td>
    </tr>
{% endfor %}
```

### Status Properties

| Property | Type | Description |
|----------|------|-------------|
| `status` | `InvoiceStatus` | Current status model |
| `status_code` | `string` | Status code shortcut |
| `status_updated_at` | `Carbon` | When status last changed |
| `is_paid` | `bool` | Whether payment has been processed |
| `is_payment_submitted` | `bool` | Whether payment was submitted (paid or pending capture) |
| `is_past_due_date` | `bool` | Whether the due date has passed |

### Contact Properties

| Property | Type | Description |
|----------|------|-------------|
| `first_name` | `string` | First name |
| `last_name` | `string` | Last name |
| `email` | `string` | Email address |
| `phone` | `string` | Phone number |
| `company` | `string` | Company name |
| `tax_id_number` | `string` | VAT/Tax ID |
| `address_line1` | `string` | Street address |
| `address_line2` | `string` | Address line 2 |
| `street_address` | `string` | Combined line 1 + line 2 |
| `city` | `string` | City |
| `zip` | `string` | Postal/ZIP code |
| `state` | `State` | State/province model |
| `country` | `Country` | Country model |

### Relationships

| Property | Type | Description |
|----------|------|-------------|
| `user` | `User` | Customer account |
| `items` | `Collection<InvoiceItem>` | Line items |
| `status_log` | `Collection<InvoiceStatusLog>` | Status change history |
| `payment_log` | `Collection<InvoicePaymentLog>` | Payment transaction log |
| `payment_method` | `PaymentMethod` | Payment method used |
| `template` | `InvoiceTemplate` | Invoice template for rendering |
| `related` | `Model` | Polymorphic related object (e.g., Order) |
| `credit_notes_from` | `Collection<CreditNote>` | Credit/debit notes linked to this invoice |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `isPaymentProcessed()` | `bool` | Check if payment is complete |
| `getCurrencyObject()` | `Currency` | Currency model for this invoice |
| `getTaxableAddress()` | `TaxLocation` | Address used for tax calculation |
| `convertToPermanent()` | `void` | Convert a throwaway invoice to permanent |
| `submitManualPayment($comment)` | `Invoice` | Record a manual payment |

### Static Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `findByInvoiceHash($hash)` | `Invoice\|null` | Look up invoice by hash |
| `makeThrowaway($user)` | `Invoice` | Create a temporary invoice |
| `makeForUser($user)` | `Invoice` | Create an invoice pre-filled with user details |

### Complete Example

```twig
<div class="invoice-detail">
    <h2>Invoice #{{ invoice.invoice_number }}</h2>
    <p>Date: {{ invoice.invoiced_at|date('M d, Y') }}</p>
    {% if invoice.due_at %}
        <p>Due: {{ invoice.due_at|date('M d, Y') }}</p>
    {% endif %}

    {# Items #}
    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Tax</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            {% for item in invoice.items %}
                <tr>
                    <td>{{ item.description }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ item.price|currency({ in: invoice.currency_code }) }}</td>
                    <td>{{ item.discount|currency({ in: invoice.currency_code }) }}</td>
                    <td>{{ item.tax|currency({ in: invoice.currency_code }) }}</td>
                    <td>{{ item.total|currency({ in: invoice.currency_code }) }}</td>
                </tr>
            {% endfor %}
        </tbody>
    </table>

    {# Totals #}
    <dl>
        <dt>Subtotal</dt>
        <dd>{{ invoice.subtotal|currency({ in: invoice.currency_code }) }}</dd>

        {% for tax in invoice.taxes %}
            <dt>{{ tax.name }}</dt>
            <dd>{{ tax.total|currency({ in: invoice.currency_code }) }}</dd>
        {% endfor %}

        <dt><strong>Total</strong></dt>
        <dd>
            <strong>
                {{ invoice.total|currency({ in: invoice.currency_code }) }}
            </strong>
        </dd>

        {% if invoice.credit_applied > 0 %}
            <dt>Store Credit</dt>
            <dd>-{{ invoice.credit_applied|currency({ in: invoice.currency_code }) }}</dd>

            <dt><strong>Amount Due</strong></dt>
            <dd>
                <strong>
                    {{ invoice.amount_due|currency({ in: invoice.currency_code }) }}
                </strong>
            </dd>
        {% endif %}
    </dl>

    {# Payment Status #}
    {% if invoice.is_paid %}
        <span class="badge bg-success">Paid</span>
    {% elseif invoice.is_past_due_date %}
        <span class="badge bg-danger">Past Due</span>
    {% else %}
        <span class="badge bg-warning">Unpaid</span>
    {% endif %}
</div>
```

---

## InvoiceItem

Each line item within an invoice. Unlike order items, invoice items use a simplified pricing model — discounts are stored as **line-level totals** (the total discount for the entire row), not per-unit values. This matches the convention used by accounting software like Xero.

### Price Properties (Per-Unit)

| Property | Type | Description |
|----------|------|-------------|
| `price` | `int` | Per-unit price (base price entered by admin) |
| `price_less_tax` | `int` | Per-unit price excluding tax |
| `price_with_tax` | `int` | Per-unit price including tax |

### Price Properties (Line-Level)

| Property | Type | Description |
|----------|------|-------------|
| `discount` | `int` | Line discount — the total discount for the entire row, not per-unit |
| `tax` | `int` | Line tax: `(unit_tax × quantity) - discount_tax` |
| `subtotal` | `int` | Line subtotal: `quantity × price - discount` |
| `total` | `int` | Line total: `subtotal + tax` |

### Other Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Primary key |
| `description` | `string` | Line item description |
| `quantity` | `int` | Quantity |
| `sort_order` | `int` | Display order |
| `created_at` | `Carbon` | Creation date |
| `updated_at` | `Carbon` | Last update date |

### Relationships

| Property | Type | Description |
|----------|------|-------------|
| `invoice` | `Invoice` | Parent invoice |
| `tax_class` | `Tax` | Tax class for this item |
| `related` | `Model` | Polymorphic related object |

### Discount Input

When setting the discount field, special formats are supported:

| Input | Behavior |
|-------|----------|
| `500` | Sets a $5.00 line discount |
| `-500` | Negative sign is stripped, treated as `500` |
| `10%` | Calculates 10% of `quantity × price` as the discount |

### Example: Simple Invoice Table

```twig
<table>
    <thead>
        <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Tax</th>
            <th>Total</th>
        </tr>
    </thead>
    <tbody>
        {% for item in invoice.items %}
            <tr>
                <td>{{ item.quantity }}x {{ item.description }}</td>
                <td>{{ item.price|currency({ in: invoice.currency_code }) }}</td>
                <td>{{ item.discount|currency({ in: invoice.currency_code }) }}</td>
                <td>{{ item.tax|currency({ in: invoice.currency_code }) }}</td>
                <td>{{ item.total|currency({ in: invoice.currency_code }) }}</td>
            </tr>
        {% endfor %}
    </tbody>
    <tfoot>
        <tr>
            <td colspan="4" class="text-end">Subtotal</td>
            <td>{{ invoice.subtotal|currency({ in: invoice.currency_code }) }}</td>
        </tr>
        {% for tax in invoice.taxes %}
            <tr>
                <td colspan="4" class="text-end">{{ tax.name }}</td>
                <td>{{ tax.total|currency({ in: invoice.currency_code }) }}</td>
            </tr>
        {% endfor %}
        <tr>
            <td colspan="4" class="text-end"><strong>Total</strong></td>
            <td>
                <strong>
                    {{ invoice.total|currency({ in: invoice.currency_code }) }}
                </strong>
            </td>
        </tr>
    </tfoot>
</table>
```

---

## InvoiceStatus

Represents an invoice status in the payment workflow.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Primary key |
| `name` | `string` | Display name |
| `code` | `string` | Unique code identifier |

### Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `STATUS_DRAFT` | `draft` | Invoice created, not yet sent |
| `STATUS_APPROVED` | `approved` | Approved for payment |
| `STATUS_PAID` | `paid` | Payment received |
| `STATUS_VOID` | `void` | Invoice voided |
| `STATUS_REFUNDED` | `refunded` | Payment refunded |

### Static Helpers

| Method | Returns | Description |
|--------|---------|-------------|
| `getNewStatus()` | `InvoiceStatus` | Find the default status for new invoices |

---

## InvoiceStatusLog

A record of each status change on an invoice.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Primary key |
| `comment` | `string\|null` | Comment added with the status change |
| `created_at` | `Carbon` | When the status change occurred |

### Relationships

| Property | Type | Description |
|----------|------|-------------|
| `status` | `InvoiceStatus` | The status that was applied |
| `invoice` | `Invoice` | The invoice |

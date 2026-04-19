---
subtitle: CreditNote model reference (Responsiv.Pay plugin).
---
# Credit Note Model

The `CreditNote` model implements a simple ledger for store credit. Credit notes (refund, adjustment, promotion) increase a customer's balance; debit notes decrease it. The balance is always `sum(credits) - sum(debits)`.

Credit notes are provided by the **Responsiv.Pay** plugin. For the merchant-facing documentation, see [Store Credit](../../merchant/order/store-credit).

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Primary key |
| `user_id` | `int` | Customer account ID |
| `invoice_id` | `int\|null` | Linked invoice ID (for refunds and debits applied at checkout) |
| `amount` | `int` | Amount in base currency units (cents). Always positive |
| `currency_code` | `string` | Three-letter currency code |
| `reason` | `string` | Human-readable description |
| `type` | `string` | One of: `refund`, `adjustment`, `debit`, `promotion` |
| `issued_by` | `int\|null` | Backend user ID who issued this note (for admin adjustments) |
| `issued_at` | `Carbon` | When the note was issued |
| `created_at` | `Carbon` | Creation date |
| `updated_at` | `Carbon` | Last update date |

### Type Constants

| Constant | Value | Effect on Balance |
|----------|-------|-------------------|
| `TYPE_REFUND` | `refund` | Increases balance |
| `TYPE_ADJUSTMENT` | `adjustment` | Increases balance |
| `TYPE_PROMOTION` | `promotion` | Increases balance |
| `TYPE_DEBIT` | `debit` | Decreases balance |

## Relationships

| Property | Type | Description |
|----------|------|-------------|
| `user` | `User` | Customer account |
| `invoice` | `Invoice\|null` | Linked invoice (refund source or checkout invoice) |
| `issued_by_user` | `BackendUser\|null` | Admin who issued the note |

## Static Methods

### getBalanceForUser

Returns the credit balance for a user in a given currency. If no currency is specified, the active currency is used.

```php
$balance = CreditNote::getBalanceForUser($user, 'USD');
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `$user` | `User` | Customer account |
| `$currencyCode` | `string\|null` | Currency code (defaults to active currency) |

**Returns:** `int`: Balance in base currency units (cents). Always >= 0.

### getHistoryForUser

Returns all credit notes for a user, ordered by most recent first. If a currency is specified, only notes in that currency are returned.

```php
$notes = CreditNote::getHistoryForUser($user, 'USD');
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `$user` | `User` | Customer account |
| `$currencyCode` | `string\|null` | Currency code (null for all currencies) |

**Returns:** `Collection<CreditNote>`

### issueRefund

Creates a credit note linked to an invoice refund. The currency is inherited from the invoice.

```php
$note = CreditNote::issueRefund($user, $invoice, 2000, 'Damaged item');
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `$user` | `User` | Customer account |
| `$invoice` | `Invoice` | Source invoice |
| `$amount` | `int` | Refund amount in cents |
| `$reason` | `string\|null` | Reason for refund |

**Returns:** `CreditNote`

### issueAdjustment

Creates a credit note for a manual admin adjustment. Currency must be specified explicitly.

```php
$note = CreditNote::issueAdjustment($user, 1000, 'USD', 'Compensation for late delivery', $adminUser);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `$user` | `User` | Customer account |
| `$amount` | `int` | Credit amount in cents |
| `$currencyCode` | `string` | Currency code |
| `$reason` | `string` | Reason for adjustment |
| `$adminUser` | `BackendUser\|null` | Admin who issued the adjustment |

**Returns:** `CreditNote`

### issueDebit

Creates a debit note that subtracts from a user's credit balance. An optional invoice can be linked.

```php
$note = CreditNote::issueDebit($user, 1500, 'USD', 'Applied to invoice', null, $invoice);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `$user` | `User` | Customer account |
| `$amount` | `int` | Debit amount in cents |
| `$currencyCode` | `string` | Currency code |
| `$reason` | `string` | Reason for debit |
| `$adminUser` | `BackendUser\|null` | Admin who issued the debit |
| `$invoice` | `Invoice\|null` | Linked invoice |

**Returns:** `CreditNote`

### applyToInvoice

Applies store credit to an invoice at checkout. Creates a debit note linked to the invoice and updates the invoice's `credit_applied` field. Uses database-level locking to prevent double-spending in concurrent checkout scenarios.

```php
$note = CreditNote::applyToInvoice($user, $invoice, $requestedAmount);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `$user` | `User` | Customer account |
| `$invoice` | `Invoice` | Target invoice |
| `$requestedAmount` | `int` | Amount to apply in cents |

**Returns:** `CreditNote`: The debit note created.

**Throws:** `ApplicationException` if the balance is insufficient or the amount is invalid.

The amount applied is capped at the invoice total. This method runs inside a database transaction with row-level locking to serialize concurrent access.

### removeFromInvoice

Reverses credit applied to an invoice by issuing an adjustment note. Resets the invoice's `credit_applied` to zero.

```php
$note = CreditNote::removeFromInvoice($user, $invoice);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `$user` | `User` | Customer account |
| `$invoice` | `Invoice` | Target invoice |

**Returns:** `CreditNote|null`: The adjustment note, or `null` if no credit was applied.

## Query Scopes

| Scope | Description |
|-------|-------------|
| `applyUser($user)` | Filter by customer |
| `applyType($type)` | Filter by type (e.g., `CreditNote::TYPE_DEBIT`) |
| `applyCurrency($code)` | Filter by currency code |

## Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `responsiv.pay.creditNote.issued` | `CreditNote $note` | Fired when any credit note is created |
| `responsiv.pay.creditNote.applied` | `User $user, Invoice $invoice, CreditNote $note` | Fired when credit is applied to an invoice |
| `responsiv.pay.invoice.creditApplied` | `Invoice $invoice, int $amount` | Fired when an invoice's credit amount changes |

## Settings

Store credit must be enabled in payment settings before the UI is available. Check programmatically with:

```php
use Responsiv\Pay\Models\Setting;

if (Setting::isCreditEnabled()) {
    // Show credit UI
}
```

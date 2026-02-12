---
subtitle: Build custom payment gateway integrations.
---
# Payment Gateways

Payment gateways handle how customers pay for orders. Meloncart uses the Responsiv.Pay plugin for payment processing, and you can add your own gateway by extending the `GatewayBase` class. This guide walks through everything you need to build a custom payment gateway — from a simple offline method to a full hosted checkout integration.

## How It Works

Payment gateways follow the **driver pattern**. A `PaymentMethod` model stores configuration, and a gateway class provides the behavior. When a payment method is created in the backend, the gateway class is attached to the model as a behavior extension.

The payment flow is:

1. Customer selects a payment method during checkout
2. The gateway's **payment form** partial is rendered on the payment page
3. Customer submits the form, calling `processPaymentForm()`
4. The gateway processes payment (inline or via redirect)
5. On success, the invoice is marked as paid
6. Meloncart automatically transitions the order to **Paid** status

## Directory Structure

```
plugins/acme/payment/
├── Plugin.php
└── paymenttypes/
    └── mypayment/
        ├── MyPayment.php
        ├── fields.yaml
        └── payment-form.htm
```

The gateway class and its config directory follow a naming convention: the directory name is the **lowercase** version of the class name. The `fields.yaml` file defines backend configuration fields, and `payment-form.htm` is the frontend payment form.

## Creating a Gateway

Extend `Responsiv\Pay\Classes\GatewayBase` and implement two required pieces: `driverDetails()` and `processPaymentForm()`.

### driverDetails

Returns metadata about your gateway:

```php
public function driverDetails()
{
    return [
        'name' => 'My Gateway',
        'description' => 'Accept payments via My Gateway.',
        'paymentForm' => true,
        'receiptPage' => true
    ];
}
```

| Key | Type | Description |
|-----|------|-------------|
| `name` | `string` | Display name in the backend |
| `description` | `string` | Description shown when selecting a gateway |
| `paymentForm` | `bool` | Whether to render a payment form partial. Set `false` for offline/manual payments |
| `receiptPage` | `bool` | Whether the gateway supports a return/receipt page |

### processPaymentForm

Processes the payment when the customer submits the payment form:

```php
public function processPaymentForm($data, $invoice)
{
    // $data — posted form data
    // $invoice — Responsiv\Pay\Models\Invoice instance
}
```

**Return values:**

| Return | Behavior |
|--------|----------|
| `Redirect` object | Redirect customer to external gateway |
| `null` | Standard redirect to receipt page |
| `false` | Prevent any redirect |

## Minimal Example: Offline Payment

This gateway accepts manual payments (bank transfer, cash on delivery) with no online processing:

```php
<?php namespace Acme\Payment\PaymentTypes;

use Responsiv\Pay\Classes\GatewayBase;

class BankTransfer extends GatewayBase
{
    public $driverFields = 'fields.yaml';

    public function driverDetails()
    {
        return [
            'name' => 'Bank Transfer',
            'description' => 'Accept offline bank transfer payments.',
            'paymentForm' => false,
            'receiptPage' => false
        ];
    }

    public function initDriverHost($host)
    {
        if (!$host->exists) {
            $host->name = 'Bank Transfer';
        }
    }

    public function processPaymentForm($data, $invoice)
    {
        // No online processing needed
    }

    public function payOfflineMessage()
    {
        return $this->getHostObject()?->payment_instructions;
    }
}
```

With `fields.yaml`:

```yaml
fields:
    payment_instructions:
        label: Payment Instructions
        type: richeditor
        tab: Configuration
        comment: Instructions displayed to the customer after placing the order.

    payment_page:
        label: Payment Page
        commentAbove: Redirect to this page instead of the default payment page.
        type: pagefinder
        tab: Configuration
```

The `payOfflineMessage()` method returns instructions displayed to the customer when this payment method is selected (e.g., bank account details, reference number format).

## Full Example: Hosted Checkout

This example shows a gateway that redirects to an external checkout page and handles the return callback:

```php
<?php namespace Acme\Payment\PaymentTypes;

use Log;
use Http;
use Redirect;
use Responsiv\Pay\Classes\GatewayBase;
use ApplicationException;
use ValidationException;
use Exception;

class HostedCheckout extends GatewayBase
{
    public $driverFields = 'fields.yaml';

    public function driverDetails()
    {
        return [
            'name' => 'Hosted Checkout',
            'description' => 'Redirect customers to a hosted payment page.'
        ];
    }

    /**
     * Set validation rules and defaults for new instances
     */
    public function initDriverHost($host)
    {
        $host->rules['api_key'] = 'required';
        $host->rules['api_secret'] = 'required';

        if (!$host->exists) {
            $host->name = 'Hosted Checkout';
            $host->test_mode = true;
        }
    }

    /**
     * Validate configuration before saving
     */
    public function validateDriverHost($host)
    {
        if ($host->test_mode && !str_starts_with($host->api_key, 'test_')) {
            throw new ValidationException([
                'api_key' => "Test API key must start with 'test_'."
            ]);
        }
    }

    /**
     * Register URL endpoints for return callbacks
     */
    public function registerAccessPoints()
    {
        return [
            'hosted_return' => 'processReturn',
        ];
    }

    /**
     * Process the payment form submission
     */
    public function processPaymentForm($data, $invoice)
    {
        try {
            $host = $this->getHostObject();
            $totals = $invoice->getTotalDetails();
            $returnUrl = $this->makeAccessPointLink('hosted_return');

            $response = Http::post('https://api.example.com/sessions', [
                'amount' => (int) $totals['total'],
                'currency' => $totals['currency'] ?? 'USD',
                'reference' => $invoice->getUniqueId(),
                'return_url' => "{$returnUrl}/{$invoice->hash}",
                'cancel_url' => $invoice->getReceiptUrl(),
                'api_key' => $host->api_key,
            ]);

            if ($response->successful()) {
                $sessionId = $response->json('session_id');
                $invoice->logPaymentAttempt(
                    "Session created: {$sessionId}",
                    true,
                    [],
                    $response->json(),
                    ''
                );
                return Redirect::to($response->json('checkout_url'));
            }

            $error = $response->json('error');
            $invoice->logPaymentAttempt($error, false, [], $response->json(), '');
            throw new ApplicationException($error);
        }
        catch (ApplicationException $ex) {
            throw $ex;
        }
        catch (Exception $ex) {
            Log::error($ex);
            throw new ApplicationException('Payment failed. Please try again.');
        }
    }

    /**
     * Handle the return callback from the hosted payment page
     */
    public function processReturn($params)
    {
        try {
            $invoice = $this->findInvoiceFromHash($params[0] ?? '');

            if ($invoice->isPaymentProcessed()) {
                return Redirect::to($invoice->getReceiptUrl());
            }

            // Verify the payment with the gateway
            $host = $this->getHostObject();
            $sessionId = request()->query('session_id');

            $response = Http::get("https://api.example.com/sessions/{$sessionId}", [
                'api_key' => $host->api_key,
            ]);

            if ($response->successful() && $response->json('status') === 'paid') {
                $transactionId = $response->json('transaction_id');
                $invoice->logPaymentAttempt(
                    "Payment confirmed: {$transactionId}",
                    true,
                    [],
                    $response->json(),
                    $transactionId
                );
                $invoice->markAsPaymentProcessed();
            }

            return Redirect::to($invoice->getReceiptUrl());
        }
        catch (Exception $ex) {
            Log::error($ex);
            throw new ApplicationException('Payment verification failed.');
        }
    }

    /**
     * Look up an invoice by its hash, with safety checks
     */
    protected function findInvoiceFromHash($hash)
    {
        if (!$hash) {
            throw new ApplicationException('Invoice not found');
        }

        $invoice = $this->createInvoiceModel()->findByUniqueHash($hash);
        if (!$invoice) {
            throw new ApplicationException('Invoice not found');
        }

        $paymentMethod = $invoice->getPaymentMethod();
        if (!$paymentMethod || $paymentMethod->getDriverClass() !== static::class) {
            throw new ApplicationException('Invalid payment method');
        }

        return $invoice;
    }
}
```

## Registration

Register your gateway in your plugin's [`Plugin.php`](https://docs.octobercms.com/4.x/extend/system/plugins.html):

```php
public function registerPaymentGateways()
{
    return [
        \Acme\Payment\PaymentTypes\BankTransfer::class => 'bank-transfer',
        \Acme\Payment\PaymentTypes\HostedCheckout::class => 'hosted-checkout',
    ];
}
```

The array key is the gateway class, and the value is a unique **alias** used internally.

## Configuration Fields

The `fields.yaml` file defines backend [form fields](https://docs.octobercms.com/4.x/element/form-fields.html) for configuring the payment method. These fields are stored in the `config_data` JSON column and accessible as properties on the host model.

```yaml
fields:
    test_mode:
        label: Test Mode
        type: switch
        tab: Configuration
        comment: Use the sandbox environment for testing.

    api_key:
        label: API Key
        type: text
        tab: Configuration

    api_secret:
        label: API Secret
        type: sensitive
        tab: Configuration
        comment: Keep this key safe. It will be encrypted in the database.
```

Access these values in your gateway using `getHostObject()`:

```php
$host = $this->getHostObject();
$apiKey = $host->api_key;
$testMode = $host->test_mode;
```

::: tip
Use the `sensitive` field type for API keys and secrets. This encrypts the value in the database and masks it in the backend form.
:::

## Payment Form Partial

The `payment-form.htm` file is rendered on the payment page when this method is selected. It has access to two variables:

| Variable | Type | Description |
|----------|------|-------------|
| `paymentMethod` | `PaymentMethod` | The payment method model (with gateway behavior) |
| `invoice` | `Invoice` | The invoice being paid |

### Simple Form

For gateways that redirect to an external page:

```twig
<p>Click the button below to complete your payment.</p>

<form method="post" data-request="onPay" data-request-flash>
    <input type="hidden" name="invoice_hash" value="{{ invoice.hash }}" />
    <button type="submit" class="btn btn-primary">Pay Now</button>
</form>
```

### Invoice Hash Fetching

When the payment form is embedded in a checkout page (rather than a standalone payment page), the invoice may not exist yet. The commerce theme's `checkout-form` JavaScript control handles this by dispatching a `pay:fetch-invoice` event that prepares the order and returns the invoice hash.

The Stripe gateway's payment form demonstrates this pattern:

```html
<form id="payment-form" method="post" data-request="onPay" data-request-flash>
    {% set hiddenFields = paymentMethod.getHiddenFields(invoice) %}
    {% for name, value in hiddenFields %}
        <input type="hidden" name="{{ name }}" value="{{ value }}"/>
    {% endfor %}
    <button type="submit" class="btn btn-primary">Pay Now</button>
</form>

<script>
oc.pageReady().then(function() {
    const payForm = document.querySelector('#payment-form');
    const invoiceHash = payForm.querySelector('input[name="invoice_hash"]');

    // Intercept form submission to fetch invoice hash if needed
    payForm.addEventListener('ajax:setup', (event) => {
        if (!invoiceHash.value) {
            event.preventDefault();

            // Request the hash from the checkout form
            const detail = { fetchFunc: null };
            window.dispatchEvent(new CustomEvent('pay:fetch-invoice', { detail }));

            if (detail.fetchFunc) {
                detail.fetchFunc().then(function(hash) {
                    invoiceHash.value = hash;
                    if (hash) oc.request(payForm);
                });
            }

            return false;
        }
    });
});
</script>
```

### External SDKs

For gateways that inject external JavaScript (like PayPal buttons), override `renderPaymentScripts()`:

```php
public function renderPaymentScripts()
{
    $queryParams = http_build_query([
        'client-id' => $this->getHostObject()->client_id,
        'components' => 'buttons',
    ]);

    return Html::script("https://sdk.example.com/v1/sdk.js?{$queryParams}");
}
```

This method injects script tags into the page globally, separate from the payment form partial.

## Access Points (Callbacks)

Access points register hidden URL endpoints for handling gateway callbacks — return URLs after redirect, webhooks, and API endpoints used by client-side JavaScript.

```php
public function registerAccessPoints()
{
    return [
        'mygateway_return' => 'processReturn',
        'mygateway_webhook' => 'processWebhook',
    ];
}
```

Each entry maps a URL segment to a method on your gateway class. The generated URLs follow the pattern:

```
/api_responsiv_pay/{access_point_code}/{params...}
```

Generate the URL in your gateway using:

```php
$returnUrl = $this->makeAccessPointLink('mygateway_return');
// => https://yoursite.com/api_responsiv_pay/mygateway_return
```

Access point methods receive URL segments as an array parameter:

```php
// URL: /api_responsiv_pay/mygateway_return/abc123/session_456
public function processReturn($params)
{
    $invoiceHash = $params[0]; // 'abc123'
    $sessionId = $params[1];   // 'session_456'
}
```

::: warning
Access point codes should be prefixed with your gateway name to avoid collisions with other gateways.
:::

## Invoice Methods

The `$invoice` object provides methods for payment processing:

| Method | Description |
|--------|-------------|
| `$invoice->hash` | Unique hash for URL identification |
| `$invoice->getTotalDetails()` | Returns `['total' => int, 'currency' => string]` |
| `$invoice->getUniqueId()` | Unique identifier for the invoice |
| `$invoice->getReceiptUrl()` | URL to the receipt/thank-you page |
| `$invoice->isPaymentProcessed()` | Check if already paid |
| `$invoice->markAsPaymentProcessed()` | Mark the invoice as paid |
| `$invoice->getPaymentMethod()` | Get the PaymentMethod model |
| `$invoice->logPaymentAttempt(...)` | Log a payment attempt |
| `$invoice->items` | Collection of invoice line items |

### Logging Payment Attempts

Always log payment attempts for debugging and audit trails:

```php
$invoice->logPaymentAttempt(
    $message,        // Status message (e.g., "Payment confirmed")
    $isSuccess,      // true or false
    $requestData,    // Array of request payload sent to gateway
    $responseData,   // Array of response data received
    $transactionId   // Gateway transaction ID
);
```

### Marking as Paid

When payment is confirmed, call `markAsPaymentProcessed()`. This fires the `responsiv.pay.invoicePaid` event, which Meloncart listens to and automatically:

1. Updates the order's payment status
2. Transitions the order to the **Paid** status

```php
if ($response->json('status') === 'completed') {
    $invoice->logPaymentAttempt('Payment confirmed', true, [], $response->json(), $transactionId);
    $invoice->markAsPaymentProcessed();
}
```

## Lifecycle Hooks

| Method | When Called |
|--------|------------|
| `initDriverHost($host)` | When the gateway is first attached to a PaymentMethod model. Use to set default values and validation rules. |
| `validateDriverHost($host)` | Before the payment method is saved. Throw `ValidationException` for invalid configuration. |
| `beforeRenderPaymentForm()` | Before the payment form partial is rendered. Use to prepare variables. |
| `invoiceAfterCreate($host, $invoice)` | After an invoice is created with this payment method. |

## Meloncart Integration

Meloncart automatically extends payment gateways with additional form fields:

**For gateways with a payment form** (`paymentForm: true`):
- **Order Status** — dropdown to select which order status to assign after successful payment (defaults to Paid)

**For gateways without a payment form** (`paymentForm: false`):
- **Order Start Status** — dropdown to select a status to assign when this payment method is selected during checkout
- **Suppress New Order Notification** — checkbox to disable new order emails for orders using this method

These fields are added automatically and require no code in your gateway.

::: info
If your gateway needs to opt out of these Meloncart-added fields, return `'shopFields' => false` in your `driverDetails()` array.
:::

## Payment Profiles

For gateways that support saved payment methods (stored cards, recurring billing), implement the payment profiles interface:

```php
public function hasPaymentProfiles()
{
    return true;
}

public function updateUserProfile($user, $data)
{
    // Create or update a stored payment method on the gateway
    // Return a UserProfile model
}

public function deleteUserProfile($user, $profile)
{
    // Remove the stored payment method from the gateway
}

public function payFromProfile($invoice)
{
    // Charge the stored payment method
    $profile = $invoice->getPaymentMethod()->findUserProfile($invoice->user);

    // Process payment using stored profile...
    $invoice->markAsPaymentProcessed();
}
```

## Reference

### GatewayBase Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `driverDetails()` | `array` | Gateway metadata |
| `processPaymentForm($data, $invoice)` | `mixed` | Process payment submission |
| `registerAccessPoints()` | `array` | Register callback URLs |
| `makeAccessPointLink($code)` | `string` | Generate callback URL |
| `getHostObject()` | `PaymentMethod` | Access the payment method model |
| `getPartialPath()` | `string` | Path to the gateway config directory |
| `renderPaymentScripts()` | `string` | Inject global scripts |
| `payOfflineMessage()` | `string` | Offline payment instructions |
| `hasPaymentForm()` | `bool` | Whether gateway uses a payment form |
| `hasReceiptPage()` | `bool` | Whether gateway supports receipt pages |
| `getReceiptPage()` | `string` | Custom receipt page code |
| `getCustomPaymentPage()` | `string` | Custom payment page code |
| `initDriverHost($host)` | `void` | Initialize driver on model |
| `validateDriverHost($host)` | `void` | Validate config before save |
| `beforeRenderPaymentForm()` | `void` | Pre-render hook |
| `invoiceAfterCreate($host, $invoice)` | `void` | Post-invoice-creation hook |
| `createInvoiceModel()` | `Invoice` | Create an Invoice instance for queries |

### Built-in Gateways

| Gateway | Alias | Description |
|---------|-------|-------------|
| `StripePayment` | `stripe` | Redirect to Stripe Checkout |
| `PayPalPayment` | `paypal` | PayPal REST API with client-side buttons |
| `CustomPayment` | `custom` | Offline/manual payment with custom instructions |

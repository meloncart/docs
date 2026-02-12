---
subtitle: Build custom shipping rate providers.
---
# Shipping Types

Shipping types calculate shipping costs during checkout. Meloncart ships with a **Table Rate** shipping type that uses a configurable rate table, but you can build your own to integrate with carrier APIs (FedEx, UPS, etc.) or implement custom pricing logic. This guide covers everything you need to create a shipping type from scratch.

## How It Works

Shipping types follow the **driver pattern**. A `ShippingMethod` model stores the configuration (name, handling fee, country restrictions, etc.), and a shipping type class provides the behavior — specifically, the `getQuote()` method that calculates the shipping cost.

When a customer enters their shipping address during checkout:

1. Meloncart queries all enabled shipping methods that match the destination and cart weight
2. Each method calls its shipping type's `getQuote()` method
3. The method adds handling fees and calculates taxes
4. Available options are presented to the customer

## Directory Structure

```
plugins/acme/shipping/
├── Plugin.php
└── shippingtypes/
    └── myshipping/
        ├── MyShipping.php
        ├── fields.yaml
        └── _setup_help.php      ← optional
```

The shipping type class and its config directory follow a naming convention: the directory name is the **lowercase** version of the class name. The `fields.yaml` defines backend configuration fields, and `_setup_help.php` is an optional partial displayed in a Help tab.

## Creating a Shipping Type

Extend `Meloncart\Shop\Classes\ShippingTypeBase` and implement two required pieces: `driverDetails()` and `getQuote()`.

### driverDetails

Returns metadata about your shipping type:

```php
public function driverDetails()
{
    return [
        'name' => 'My Shipping',
        'description' => 'Calculate shipping via My Carrier API.'
    ];
}
```

### getQuote

The core method. Receives shipping destination and cart details, returns a price or `null` if not available.

```php
public function getQuote(array $options)
{
    // Return price in cents, or null if not available
}
```

## Quote Options

The `getQuote()` method receives an array describing the destination and cart contents:

| Option | Type | Description |
|--------|------|-------------|
| `countryId` | `int\|null` | `RainLab\Location\Models\Country` ID |
| `countryCode` | `string\|null` | Two-letter country code (e.g., `US`) |
| `stateId` | `int\|null` | `RainLab\Location\Models\State` ID |
| `stateCode` | `string\|null` | State/province code (e.g., `CA`) |
| `zip` | `string\|null` | Postal/ZIP code |
| `city` | `string\|null` | City name |
| `totalPrice` | `int` | Cart total in cents |
| `totalVolume` | `float` | Total volume of items |
| `totalWeight` | `float` | Total weight of items |
| `totalItems` | `int` | Number of items in the cart |
| `orderItems` | `array` | Array of cart item objects (with `product` and `quantity`) |
| `isBusiness` | `bool` | Whether the address is a business |

## Quote Return Format

The `getQuote()` method supports three return formats:

### Single Price

Return an integer for a single shipping rate. Prices are always in **base currency cents**.

```php
// $5.00 flat rate
return 500;
```

### Multiple Options

Return an array to offer child options (e.g., Standard vs Express). Each option needs an `id` and `quote`:

```php
return [
    'Standard (5-7 days)' => ['id' => 'standard', 'quote' => 500],
    'Express (2-3 days)' => ['id' => 'express', 'quote' => 1500],
    'Overnight' => ['id' => 'overnight', 'quote' => 3500]
];
```

Child options appear as sub-choices under the shipping method in the checkout UI. The `id` must be unique within the method.

### Not Available

Return `null` when shipping is not available for the given destination:

```php
if (!$countryId) {
    return null;
}
```

## Minimal Example: Flat Rate

```php
<?php namespace Acme\Shipping\ShippingTypes;

use Meloncart\Shop\Classes\ShippingTypeBase;

class FlatRate extends ShippingTypeBase
{
    public $driverFields = 'fields.yaml';

    public function driverDetails()
    {
        return [
            'name' => 'Flat Rate',
            'description' => 'Charge a flat shipping rate for all orders.'
        ];
    }

    public function getQuote(array $options)
    {
        extract(array_merge([
            'countryId' => null,
        ], $options));

        if (!$countryId) {
            return null;
        }

        return $this->getHostObject()->flat_rate;
    }
}
```

With `fields.yaml`:

```yaml
fields:
    flat_rate:
        label: Flat Rate Amount
        comment: Shipping rate in dollars (e.g., 5.00)
        type: currency
        span: auto
```

## Full Example: Weight-Based Zones

This example shows a more realistic shipping type that calculates rates based on weight and destination zone:

```php
<?php namespace Acme\Shipping\ShippingTypes;

use Meloncart\Shop\Classes\ShippingTypeBase;
use RainLab\Location\Models\Country;

class WeightZone extends ShippingTypeBase
{
    public $driverFields = 'fields.yaml';

    public function driverDetails()
    {
        return [
            'name' => 'Weight Zone Shipping',
            'description' => 'Calculate shipping based on weight and destination zone.'
        ];
    }

    public function getQuote(array $options)
    {
        extract(array_merge([
            'countryId' => null,
            'totalWeight' => 0,
        ], $options));

        if (!$countryId) {
            return null;
        }

        $host = $this->getHostObject();
        $country = Country::findByKey($countryId);
        if (!$country) {
            return null;
        }

        // Determine the shipping zone
        $zone = $this->getZoneForCountry($country->code);
        if (!$zone) {
            return null;
        }

        // Calculate rate: base + per-kg rate
        $baseRate = $zone['base_rate'];
        $perKgRate = $zone['per_kg_rate'];
        $rate = $baseRate + ($totalWeight * $perKgRate);

        // Offer standard and express
        return [
            'Standard' => [
                'id' => 'standard',
                'quote' => (int) round($rate)
            ],
            'Express' => [
                'id' => 'express',
                'quote' => (int) round($rate * $host->express_multiplier)
            ]
        ];
    }

    protected function getZoneForCountry($countryCode)
    {
        $zones = $this->getHostObject()->zones ?: [];

        foreach ($zones as $zone) {
            $countries = array_map('trim', explode(',', $zone['countries'] ?? ''));
            if (in_array($countryCode, $countries) || in_array('*', $countries)) {
                return $zone;
            }
        }

        return null;
    }
}
```

## Full Example: Carrier API Integration

This example shows how to integrate with an external shipping API:

```php
<?php namespace Acme\Shipping\ShippingTypes;

use Http;
use Cache;
use Meloncart\Shop\Classes\ShippingTypeBase;
use RainLab\Location\Models\Country;
use RainLab\Location\Models\State;
use Exception;

class CarrierApi extends ShippingTypeBase
{
    public $driverFields = 'fields.yaml';

    public function driverDetails()
    {
        return [
            'name' => 'Carrier API',
            'description' => 'Real-time shipping rates from carrier API.'
        ];
    }

    public function getQuote(array $options)
    {
        extract(array_merge([
            'countryId' => null,
            'stateId' => null,
            'zip' => null,
            'totalWeight' => 0,
        ], $options));

        if (!$countryId || !$zip) {
            return null;
        }

        $host = $this->getHostObject();
        $country = Country::findByKey($countryId);
        $state = State::findByKey($stateId);

        try {
            $response = Http::withToken($host->api_token)
                ->post('https://api.carrier.com/v1/rates', [
                    'origin_zip' => $host->origin_zip,
                    'dest_country' => $country?->code,
                    'dest_state' => $state?->code,
                    'dest_zip' => $zip,
                    'weight' => $totalWeight,
                    'weight_unit' => 'lb',
                ]);

            if (!$response->successful()) {
                return null;
            }

            // Build child options from API response
            $rates = $response->json('rates');
            $result = [];

            foreach ($rates as $rate) {
                $result[$rate['service_name']] = [
                    'id' => $rate['service_code'],
                    'quote' => (int) round($rate['total_price'] * 100)
                ];
            }

            return !empty($result) ? $result : null;
        }
        catch (Exception $ex) {
            return null;
        }
    }
}
```

## Registration

Register your shipping type in your plugin's [`Plugin.php`](https://docs.octobercms.com/4.x/extend/system/plugins.html):

```php
public function registerShippingTypes()
{
    return [
        \Acme\Shipping\ShippingTypes\FlatRate::class => 'flat-rate',
        \Acme\Shipping\ShippingTypes\WeightZone::class => 'weight-zone',
    ];
}
```

The array key is the shipping type class, and the value is a unique **alias** used internally.

## Configuration Fields

The `fields.yaml` file defines backend [form fields](https://docs.octobercms.com/4.x/element/form-fields.html). These values are stored in the `config_data` JSON column on the `ShippingMethod` model and accessible as properties via `getHostObject()`.

```yaml
fields:
    origin_zip:
        label: Origin ZIP Code
        type: text
        tab: Configuration

    api_token:
        label: API Token
        type: sensitive
        tab: Configuration
```

Access configuration values in your shipping type:

```php
$host = $this->getHostObject();
$originZip = $host->origin_zip;
$apiToken = $host->api_token;
```

### Dynamic Dropdown Options

For datatable fields (like the Table Rate's rate table), you can provide dynamic dropdown options by implementing `getDataTableOptions()`:

```php
public function getDataTableOptions($attribute, $field, $data)
{
    if ($field === 'country') {
        return Country::applyEnabled()->lists('name', 'code');
    }

    if ($field === 'state') {
        return State::whereHas('country', function ($q) use ($data) {
            $q->where('code', $data['country'] ?? '');
        })->lists('name', 'code');
    }

    return [];
}
```

## Shipping Method Model

Your shipping type is attached to a `ShippingMethod` model that provides these built-in features without any code in your driver:

| Feature | Description |
|---------|-------------|
| **Handling fee** | Fixed amount added to every quote automatically |
| **Weight limits** | Min/max weight filters — methods outside range are excluded |
| **Country restrictions** | Limit to specific countries (methods with no countries apply to all) |
| **User group restrictions** | Limit to specific user groups |
| **Taxable shipping** | Whether tax is calculated on the shipping cost |
| **Quote caching** | Quotes are cached per-request using an option hash |

These features are configured in the backend form and applied by the `ShippingMethod` model before returning quotes to the checkout.

### How Quotes Are Processed

When `ShippingMethod::listApplicable()` runs during checkout:

1. Queries enabled methods matching weight, country, and user group filters
2. Calls your `getQuote()` method
3. Adds the handling fee to the returned quote
4. Adds per-product shipping costs (from product extras)
5. Calculates shipping taxes if the method is taxable
6. Returns methods with `quote`, `quoteOriginal`, and `quoteFinal` properties set

You don't need to handle handling fees, taxes, or per-product costs in your `getQuote()` method — those are applied automatically.

## Shipping Labels

Shipping types can optionally support label generation for order fulfillment:

```php
public function supportsShippingLabels()
{
    return true;
}

public function generateShippingLabels(Order $order, array $options = [])
{
    // Call carrier API to generate labels
    // Return label data (PDF binary, URL, etc.)
}
```

## Setup Help Partial

Create a `_setup_help.php` file in your shipping type's config directory to display setup instructions in a Help tab on the backend form:

```php
<!-- shippingtypes/carriershipping/_setup_help.php -->
<div class="callout fade in callout-info no-subheader">
    <div class="header">
        <i class="icon-info"></i>
        <h3>Getting Started</h3>
    </div>
    <div class="content">
        <ol>
            <li>Sign up for an API account at carrier.com</li>
            <li>Copy your API token from the dashboard</li>
            <li>Enter your origin ZIP code and API token in the Configuration tab</li>
        </ol>
    </div>
</div>
```

## Lifecycle Hooks

| Method | When Called |
|--------|------------|
| `initDriverHost($host)` | When the driver is first attached to a ShippingMethod model. Set default values. |
| `validateDriverHost($host)` | Before the shipping method is saved. Throw `ValidationException` for invalid config. |

```php
public function initDriverHost($host)
{
    if (!$host->exists) {
        $host->name = 'My Shipping';
    }
}

public function validateDriverHost($host)
{
    if ($host->max_weight && $host->min_weight && $host->min_weight > $host->max_weight) {
        throw new \ValidationException([
            'max_weight' => 'Max weight must be greater than min weight.'
        ]);
    }
}
```

## Reference

### ShippingTypeBase Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `driverDetails()` | `array` | Shipping type metadata (`name`, `description`) |
| `getQuote(array $options)` | `int\|array\|null` | Calculate shipping cost |
| `getHostObject()` | `ShippingMethod` | Access the shipping method model and config |
| `getPartialPath()` | `string` | Path to the config directory |
| `getDataTableOptions($attr, $field, $data)` | `array` | Dynamic options for datatable dropdowns |
| `supportsShippingLabels()` | `bool` | Whether label generation is supported |
| `generateShippingLabels($order, $options)` | `mixed` | Generate shipping labels for an order |
| `initDriverHost($host)` | `void` | Initialize driver on model |
| `validateDriverHost($host)` | `void` | Validate config before save |

### Built-in Shipping Types

| Type | Alias | Description |
|------|-------|-------------|
| `TableRateShipping` | `table-rate` | Configurable rate table with location, weight, volume, subtotal, and item count matching |

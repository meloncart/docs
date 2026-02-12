---
subtitle: Build custom discount actions and conditions.
---
# Price Rules

Meloncart's price rule system supports two types of extensions: **actions** (what discount to apply) and **conditions** (when to apply it). You can register your own actions and conditions to create custom discount logic beyond what's built in.

There are two categories of price rules:

- **Cart rules** — Applied during checkout, discount the shopping cart (e.g., "10% off orders over $100")
- **Catalog rules** — Applied at display time, modify product prices before the cart (e.g., "20% off all electronics")

## How It Works

Price rules are configured in the backend under **Shop > Price Rules** (cart) and **Shop > Catalog Rules** (catalog). Each rule has:

1. An **action** — the discount logic (percentage off, fixed amount, buy-M-get-N-free, etc.)
2. **Conditions** — when the rule applies (cart subtotal, product category, customer group, etc.)
3. **Configuration** — action-specific settings (discount amount, max cap, etc.)

When evaluating rules:

- Rules are processed in `sort_order` (lowest first)
- Each rule's conditions are checked first
- If conditions pass, the action calculates the discount
- A rule with **stop processing** enabled prevents further rules from evaluating

## Registration

Register actions and conditions in your plugin's [`Plugin.php`](https://docs.octobercms.com/4.x/extend/system/plugins.html):

```php
public function registerShopPriceRules()
{
    return [
        'actions' => [
            \Acme\Pricing\PriceRules\MyCartAction::class,
            \Acme\Pricing\PriceRules\MyCatalogAction::class,
        ],
        'conditions' => [
            \Acme\Pricing\PriceRules\MyCondition::class,
        ]
    ];
}
```

The system discovers actions and conditions using `PluginManager::getRegistrationMethodValues('registerShopPriceRules')` across all plugins.

## Cart Rule Actions

Cart rule actions discount the shopping cart during checkout. Extend `CartRuleActionBase` and implement `evalDiscount()`.

### Base Class

```php
<?php namespace Acme\Pricing\PriceRules;

use Meloncart\Shop\Classes\CartRuleActionBase;

class MyCartAction extends CartRuleActionBase
{
    public function getName()
    {
        return 'My custom cart discount';
    }

    public function defineValidationRules()
    {
        return [
            'discount_amount' => 'required|numeric',
        ];
    }

    public function evalDiscount(
        &$params,
        $hostObj,
        &$itemDiscountMap,
        &$itemDiscountTaxInclMap,
        $productConditions
    ) {
        // Calculate and return the total discount
        return 0;
    }
}
```

::: info
Cart actions automatically return `TYPE_CART` from `getActionType()` — you don't need to override it.
:::

### evalDiscount Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `$params` | `array` | Cart state — see parameters table below |
| `$hostObj` | `CartPriceRule` | The rule model with your config values (e.g., `$hostObj->discount_amount`) |
| `$itemDiscountMap` | `array` | Discount per cart item key (updated by your action) |
| `$itemDiscountTaxInclMap` | `array` | Tax-inclusive discount per item key |
| `$productConditions` | `RuleConditionBase\|null` | Product filter conditions from the rule's Products tab |

**Cart Parameters (`$params`):**

| Key | Type | Description |
|-----|------|-------------|
| `cart_items` | `CartItemCollection` | Active cart items |
| `current_subtotal` | `float` | Subtotal accounting for prior rule discounts |
| `user` | `User\|null` | Current customer |
| `coupon` | `Coupon\|null` | Applied coupon code |
| `shipping_address` | `CheckoutAddress\|null` | Shipping address |
| `prices_include_tax` | `bool` | Whether display prices include tax |

### Cart-Wide vs Per-Product

Cart actions come in two flavors:

**Cart-wide** — Discount the entire cart (default). The action distributes the discount across items.

```php
public function isPerProductAction()
{
    return false;
}
```

**Per-product** — Discount individual items that match product conditions.

```php
public function isPerProductAction()
{
    return true;
}
```

Use the `isActiveForProduct()` helper to check whether an item matches the rule's product conditions:

```php
foreach ($cartItems as $item) {
    $currentPrice = $item->totalSinglePrice() - $itemDiscountMap[$item->key];

    if (!$this->isActiveForProduct($item->product, $productConditions, $currentPrice)) {
        continue;
    }

    // Apply discount to this item
}
```

### Example: Cart-Wide Percentage with Cap

```php
class CartPercentageCap extends CartRuleActionBase
{
    public function getName()
    {
        return 'Percentage off cart (with max cap)';
    }

    public function defineValidationRules()
    {
        return [
            'discount_amount' => 'required|numeric',
            'max_discount' => 'required|numeric',
        ];
    }

    public function evalDiscount(
        &$params,
        $hostObj,
        &$itemDiscountMap,
        &$itemDiscountTaxInclMap,
        $productConditions
    ) {
        $discount = $params['current_subtotal'] * $hostObj->discount_amount / 100;
        $discount = min($discount, $hostObj->max_discount);

        // Distribute across items
        $cartItems = $params['cart_items'];
        $totalDiscount = 0;
        $remainder = $discount;

        foreach ($cartItems as $item) {
            $currentPrice = max(
                $item->totalSinglePrice() - $itemDiscountMap[$item->key],
                0
            );

            $perUnit = min($remainder / $item->quantity, $currentPrice);
            $itemDiscountMap[$item->key] += $perUnit;
            $totalDiscount += $perUnit * $item->quantity;
            $remainder -= $perUnit * $item->quantity;

            if ($remainder <= 0) {
                break;
            }
        }

        return $totalDiscount;
    }
}
```

### Example: Per-Product Fixed Discount

```php
class ProductFixedDiscount extends CartRuleActionBase
{
    public function getName()
    {
        return 'Fixed amount off matching products';
    }

    public function defineValidationRules()
    {
        return [
            'discount_amount' => 'required|numeric',
        ];
    }

    public function isPerProductAction()
    {
        return true;
    }

    public function evalDiscount(
        &$params,
        $hostObj,
        &$itemDiscountMap,
        &$itemDiscountTaxInclMap,
        $productConditions
    ) {
        $cartItems = $params['cart_items'];
        $totalDiscount = 0;

        foreach ($cartItems as $item) {
            $currentPrice = max(
                $item->totalSinglePrice() - $itemDiscountMap[$item->key],
                0
            );

            if (!$this->isActiveForProduct(
                $item->product,
                $productConditions,
                $currentPrice
            )) {
                continue;
            }

            $discount = min($hostObj->discount_amount, $currentPrice);
            $itemDiscountMap[$item->key] += $discount;
            $totalDiscount += $discount * $item->quantity;
        }

        return $totalDiscount;
    }
}
```

## Catalog Rule Actions

Catalog rule actions modify product prices at display time — before items are added to the cart. Extend `RuleActionBase` with `TYPE_PRODUCT` and implement `evalAmount()`.

### Base Class

```php
<?php namespace Acme\Pricing\PriceRules;

use Meloncart\Shop\Classes\RuleActionBase;

class MyCatalogAction extends RuleActionBase
{
    public function getActionType()
    {
        return self::TYPE_PRODUCT;
    }

    public function getName()
    {
        return 'My custom catalog discount';
    }

    public function defineValidationRules()
    {
        return [
            'discount_amount' => 'required|numeric',
        ];
    }

    /**
     * @param array $params Contains 'current_price' and 'product'
     * @param mixed $hostObj The rule model with config values
     * @return float New price in cents
     */
    public function evalAmount(&$params, $hostObj)
    {
        $currentPrice = $params['current_price'];
        return max(0, $currentPrice - $hostObj->discount_amount);
    }
}
```

### evalAmount Parameters

| Key in `$params` | Type | Description |
|-------------------|------|-------------|
| `current_price` | `float` | Product price after prior rules have been applied |
| `product` | `Product` | The product model |

The method should return the **new price** (not the discount amount). The system calculates the discount as `current_price - evalAmount()`.

### Example: Seasonal Percentage

```php
class SeasonalPercentage extends RuleActionBase
{
    public function getActionType()
    {
        return self::TYPE_PRODUCT;
    }

    public function getName()
    {
        return 'Seasonal percentage reduction';
    }

    public function evalAmount(&$params, $hostObj)
    {
        $currentPrice = $params['current_price'];
        return max(0, $currentPrice - ($currentPrice * $hostObj->discount_amount / 100));
    }
}
```

## Rule Conditions

Conditions determine **when** a price rule applies. Extend `RuleConditionBase` and implement `isTrue()`.

### Base Class

```php
<?php namespace Acme\Pricing\PriceRules;

use Meloncart\Shop\Classes\RuleConditionBase;

class MyCondition extends RuleConditionBase
{
    public function getConditionType()
    {
        return self::TYPE_CART_ATTRIBUTE;
    }

    public function getName()
    {
        return 'My custom condition';
    }

    public function getTitle()
    {
        return 'My Custom Condition';
    }

    public function isTrue(&$params)
    {
        // Return true if condition is met
        return false;
    }
}
```

### Condition Types

Use these constants to determine where your condition appears:

| Constant | Use For |
|----------|---------|
| `TYPE_CART_ROOT` | Top-level cart conditions (compound AND/OR groups) |
| `TYPE_CART_ATTRIBUTE` | Cart attribute conditions (subtotal, weight, location) |
| `TYPE_CART_PRODUCT_ATTRIBUTE` | Per-product conditions within a cart rule |
| `TYPE_PRODUCT` | Catalog product conditions |
| `TYPE_ANY` | Universal conditions (valid anywhere) |

### isTrue Parameters

The `$params` array contents depend on the condition type:

**Cart conditions** receive:

| Key | Type | Description |
|-----|------|-------------|
| `subtotal` | `float` | Cart subtotal |
| `cart_items` | `CartItemCollection` | Cart items |
| `user` | `User\|null` | Current customer |
| `coupon` | `Coupon\|null` | Applied coupon |
| `shipping_address` | `CheckoutAddress\|null` | Shipping address |

**Product conditions** receive:

| Key | Type | Description |
|-----|------|-------------|
| `product` | `Product` | The product being evaluated |
| `current_price` | `float` | Product price after prior rules |

### Example: Minimum Cart Value

```php
class MinCartValue extends RuleConditionBase
{
    public function getConditionType()
    {
        return self::TYPE_CART_ATTRIBUTE;
    }

    public function getName()
    {
        return 'Cart minimum value';
    }

    public function getTitle()
    {
        return 'Cart subtotal is at least ' . $this->host->min_amount;
    }

    public function defineValidationRules()
    {
        return ['min_amount' => 'required|numeric'];
    }

    public function isTrue(&$params)
    {
        return ($params['subtotal'] ?? 0) >= $this->host->min_amount;
    }
}
```

### Example: Product Has Tag

```php
class ProductHasTag extends RuleConditionBase
{
    public function getConditionType()
    {
        return self::TYPE_PRODUCT;
    }

    public function getName()
    {
        return 'Product has tag';
    }

    public function getTitle()
    {
        return 'Product has tag: ' . $this->host->tag_name;
    }

    public function isTrue(&$params)
    {
        $product = $params['product'] ?? null;
        if (!$product) {
            return false;
        }

        return $product->tags->contains('name', $this->host->tag_name);
    }
}
```

## Configuration Fields

Each action and condition can define backend [form fields](https://docs.octobercms.com/4.x/element/form-fields.html) via a `fields.yaml` file in its config directory:

```
pricerules/
└── mycartaction/
    ├── fields.yaml
    └── MyCartAction.php
```

```yaml
fields:
    discount_amount:
        label: Discount Amount
        commentAbove: Enter the discount percentage (e.g., 10 for 10%).
        type: number

    max_discount:
        label: Maximum Discount
        commentAbove: Cap the discount at this amount.
        type: currency
        span: auto
```

The `defineFormFields()` method returns the path to this file (defaults to `'fields.yaml'`). Field values are stored on the rule model and accessible via `$hostObj->field_name` in your action, or `$this->host->field_name` in your condition.

## Initialization and Defaults

Override `initConfigData()` to set default values when a rule is first created with your action:

```php
public function initConfigData($host)
{
    $host->discount_amount = 10;
    $host->max_discount = 5000; // $50.00
}
```

## Built-in Actions

### Cart Actions

| Class | Description |
|-------|-------------|
| `CartPercentageAction` | Discount cart subtotal by percentage |
| `CartFixedAction` | Discount cart by fixed amount |
| `CartBuyMGetNFreeAction` | Buy M items, get N free (supports multiples) |
| `CartProductPercentAction` | Percentage off matching products |
| `CartProductFixedAction` | Fixed amount off matching products |
| `CartProductFixedPriceAction` | Set matching products to a fixed price |
| `CartProductFreeShippingAction` | Free shipping for matching products |

### Catalog Actions

| Class | Description |
|-------|-------------|
| `ProductByPercentageAction` | Reduce price by percentage of original |
| `ProductByFixedAmountAction` | Reduce price by fixed amount |
| `ProductToFixedPriceAction` | Set product to a fixed price |
| `ProductToPercentageAction` | Set price to a percentage of original |

## Built-in Conditions

| Class | Type | Description |
|-------|------|-------------|
| `CartAttributeCondition` | Cart | Cart subtotal, quantity, weight, country, state, zip, shipping/payment method |
| `CartItemAttributeCondition` | Cart | Individual cart item attributes |
| `CartItemPresenceCondition` | Cart | Check for specific products in the cart |
| `CartProductAmtQtyCondition` | Cart | Product amount or quantity conditions |
| `ProductAttributeCondition` | Product | Product name, price, SKU, category, manufacturer, sale status |

## Reference

### RuleActionBase Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getActionType()` | `string` | `TYPE_PRODUCT` or `TYPE_CART` |
| `getName()` | `string` | Display name for dropdown menus |
| `defineFormFields()` | `string` | Path to `fields.yaml` |
| `defineValidationRules()` | `array` | Validation rules for config fields |
| `initConfigData($host)` | `void` | Set default values on new rules |
| `getFieldConfig()` | `object` | Parsed field configuration |

### CartRuleActionBase Methods

Inherits all `RuleActionBase` methods, plus:

| Method | Returns | Description |
|--------|---------|-------------|
| `evalDiscount(&$params, $hostObj, &$itemDiscountMap, &$itemDiscountTaxInclMap, $productConditions)` | `float` | Calculate the discount |
| `isPerProductAction()` | `bool` | Whether discount is per-product or cart-wide |
| `isActiveForProduct($product, $productConditions, $currentPrice, $ruleParams, $item)` | `bool` | Check product against conditions |

### RuleConditionBase Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `TYPE_ANY` | `'any'` | Valid anywhere |
| `TYPE_PRODUCT` | `'product'` | Catalog product conditions |
| `TYPE_CART` | `'cart'` | Cart compound conditions |
| `TYPE_CART_ROOT` | `'cart-root'` | Top-level cart conditions |
| `TYPE_CART_ATTRIBUTE` | `'cart-attribute'` | Cart attribute conditions |
| `TYPE_CART_PRODUCT_ATTRIBUTE` | `'cart-product-attribute'` | Per-product cart conditions |

### ConditionBase Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getConditionType()` | `string` | One of the `TYPE_*` constants |
| `getName()` | `string` | Display name for dropdown menus |
| `getTitle()` | `string` | Title for condition settings form |
| `isTrue(&$params)` | `bool` | Evaluate the condition |
| `defineFormFields()` | `string` | Path to `fields.yaml` |
| `defineValidationRules()` | `array` | Validation rules for config fields |
| `initConfigData($host)` | `void` | Set defaults on new conditions |
| `getGroupingTitle()` | `string\|null` | Group label in Create Condition dropdown |

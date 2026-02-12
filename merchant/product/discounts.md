---
subtitle: Set up price rules, discount coupons and promotional pricing.
---
# Discounts

Meloncart provides two pricing rule systems — **cart price rules** and **catalog price rules** — along with **coupon codes** that can be attached to cart rules. Together, these tools let you run promotions, offer volume discounts, apply automatic markdowns, and create coupon-based campaigns.

## Cart Price Rules

Cart price rules apply discounts at checkout time, based on the contents of the shopping cart, the customer's location, or other conditions. Navigate to **Shop → Discounts** to manage cart price rules.

Click **New Discount** to create a rule. Each rule has the following settings:

- **Name** — An internal name for the rule (e.g., "Summer Sale 20% Off").
- **Active** — Whether the rule is currently in effect.
- **Sort Order** — Controls the order in which rules are evaluated. Lower numbers are evaluated first.
- **Date Start / Date End** — Optional date range during which the rule is active. Leave both empty for an always-active rule.
- **Terminate** — When enabled, no further cart rules are evaluated after this one matches. Useful for ensuring only one promotion applies.

### Cart Rule Actions

The **Action** dropdown defines what happens when the rule's conditions are met. Meloncart includes seven built-in action types:

| Action | Description |
|--------|-------------|
| **Discount the shopping cart subtotal by X percent** | Reduces the entire cart subtotal by a percentage (e.g., 10% off the whole order). |
| **Discount the shopping cart subtotal by fixed amount** | Reduces the cart subtotal by a fixed amount (e.g., $20 off). The discount is distributed proportionally across matching items. |
| **Buy M get N free** | Customers who purchase M units of a qualifying product receive N units free. Can be configured to apply once or multiply with quantity. |
| **Discount each cart item unit price by percentage** | Applies a percentage discount to each matching item individually (e.g., 15% off all shirts). |
| **Discount each cart item unit price by fixed amount** | Subtracts a fixed amount from each matching item's unit price. |
| **Discount each cart item unit price to a fixed price** | Sets each matching item to a specific price (e.g., all clearance items at $5). |
| **Apply free shipping to the cart products** | Waives shipping costs for matching items. |

Each action type has its own configuration fields. For example, percentage-based actions ask for a discount percentage, while the Buy M Get N Free action asks for the M (buy) and N (free) quantities and whether multiples are allowed.

### Cart Rule Conditions

Conditions determine when a cart rule should apply. Without conditions, the rule applies to every order. Click the **Conditions** section to build a condition tree using the visual condition builder.

Meloncart provides five condition types:

| Condition | Description |
|-----------|-------------|
| **Shopping cart attribute** | Evaluates cart-level values such as subtotal, total quantity, total weight, total discount, shipping method, payment method, shipping country, shipping state, or ZIP code. |
| **Shopping cart item attribute** | Evaluates individual cart item values such as unit price, row total, quantity, discount, or whether the item is a bundle. |
| **Item presence** | Checks whether a product matching specific attributes is present (or not present) in the cart. |
| **Cart item quantity or total amount** | Evaluates the total quantity or total dollar amount of cart items matching specific product criteria. |
| **Product attribute** | Evaluates product-level attributes such as specific product selection, price, categories, manufacturer, or whether catalog price rules are already applied. |

#### Building Conditions

The condition builder uses a tree structure where conditions can be combined with **AND** or **OR** logic. Click **Add Condition** to add a new rule to the tree. Each condition consists of three parts:

1. **Attribute** — What to check (e.g., cart subtotal, product category).
2. **Operator** — How to compare (e.g., equals, greater than, less than, is one of).
3. **Value** — The target value to compare against.

For example, to create a rule that applies only when the cart subtotal exceeds $100, add a **Shopping cart attribute** condition with the attribute set to "subtotal", the operator set to "equals or greater", and the value set to your threshold.

#### Product-Specific Conditions

Cart rules can also have a separate **Products** condition section that narrows which items in the cart the action applies to. This is separate from the main conditions and is used by per-product actions (such as "Discount each cart item unit price by percentage").

For example, you could create a rule that gives 20% off all products in the "Accessories" category, regardless of what else is in the cart.

### User Group Restrictions

Cart rules can optionally be restricted to specific customer groups. When user groups are assigned to a rule, only customers belonging to those groups receive the discount. This is useful for member-exclusive promotions or wholesale pricing.

## Catalog Price Rules

Catalog price rules modify the displayed price of products across your storefront. Unlike cart rules, which apply at checkout, catalog rules affect the price shown on product listing pages and detail pages. Navigate to **Shop → Price Rules** to manage catalog price rules.

Click **New Price Rule** to create a rule. The settings are similar to cart rules:

- **Name** — An internal name for the rule.
- **Active** — Whether the rule is in effect.
- **Sort Order** — Evaluation order (lower first).
- **Date Start / Date End** — Optional active date range.
- **Terminate** — Stop evaluating further rules after this one matches.

### Catalog Rule Actions

Catalog rules support four action types:

| Action | Description |
|--------|-------------|
| **By percentage of the original price** | Reduces the product price by a percentage (e.g., 10% off). |
| **By fixed amount** | Reduces the product price by a fixed amount (e.g., $5 off). |
| **To fixed price** | Sets the product to a specific price (e.g., $19.99). |
| **To percentage of the original price** | Sets the price to a percentage of the original (e.g., 50% means half price). |

### Catalog Rule Conditions

Catalog rules use the **Product attribute** condition type to determine which products are affected. You can target products by:

- Specific product selection
- Product price range
- Category membership
- Manufacturer
- Whether other catalog rules are already applied

### How Catalog Rules Are Applied

Catalog price rules are compiled and cached. When you save a catalog rule, the system recalculates the affected product prices and stores the results. This means catalog rules do not add overhead to page load times — the compiled prices are read directly.

Rules are evaluated in sort order. If multiple rules match a product, each rule's action is applied to the result of the previous rule. When a rule has the **Terminate** flag enabled, no further rules are evaluated for that product.

Catalog rules also interact with user groups. A rule can be restricted to specific groups, and the system compiles separate price results for each group. This allows you to show different prices to wholesale and retail customers.

::: tip
Catalog price rules and sale prices (set directly on the product) are independent features. If both are configured, the system uses whichever produces the lower final price for the customer.
:::

## Coupon Codes

Coupons provide a code that customers enter at checkout to activate a cart price rule. Navigate to **Shop → Discounts** and use the coupon field on a cart price rule to link it to a coupon, or manage coupons directly.

Each coupon has:

- **Code** — The code customers enter (e.g., "SAVE20", "WELCOME10").
- **Enabled** — Whether the coupon is currently active.
- **Expires At** — An optional expiration date after which the coupon is no longer valid.
- **Usage Limit** — The maximum number of times the coupon can be used across all customers. Leave empty for unlimited use.
- **Times Used** — A counter that tracks how many times the coupon has been redeemed. This increments automatically when an order using the coupon is completed.

### Linking Coupons to Rules

A coupon is linked to a cart price rule through the rule's **Coupon** field. When a coupon is assigned to a rule, the rule only activates when the customer enters the matching coupon code at checkout. Without a coupon, the cart rule applies automatically to all qualifying orders.

::: info
A single coupon can be linked to one cart price rule. If you need the same code to trigger multiple discounts, combine the actions into a single rule or use a percentage discount that covers all intended products.
:::

### Coupon Validation

When a customer enters a coupon code at checkout, the system validates:

1. The coupon exists and is enabled.
2. The coupon has not expired.
3. The coupon has not exceeded its usage limit.

If validation fails, the customer sees an error message and the discount is not applied.

## Rule Priority and Evaluation Order

Both cart and catalog rules are evaluated in the order defined by their **Sort Order** field. This matters when multiple rules could apply:

1. Rules with a lower sort order are evaluated first.
2. Each rule's conditions are checked — if they match, the action is applied.
3. If a rule has the **Terminate** flag enabled and its conditions match, no further rules of the same type are evaluated.

For cart rules, this means you can create a priority system where more specific promotions take precedence over general ones by giving them a lower sort order and enabling the terminate flag.

## Combining Discounts

Meloncart supports multiple discount mechanisms that can work together:

- **Sale prices** (set on the product) affect the displayed price on the storefront.
- **Catalog price rules** also affect the displayed price and are compiled automatically.
- **Cart price rules** apply at checkout and reduce the order total.
- **Price tiers** provide volume-based pricing per product.

When multiple mechanisms apply, the system resolves the final price using the lowest available price from sale prices and catalog rules, then applies any qualifying cart rules on top.

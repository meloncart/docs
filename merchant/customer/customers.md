---
subtitle: Manage customer accounts, groups and order history.
---
# Users

Customer accounts in Meloncart are powered by the **RainLab.User** plugin. Every customer who registers on your storefront gets a user account that stores their profile details, addresses, and order history. You manage customers through the standard **Users** section in the backend.

## Viewing Customers

Navigate to **Users** in the backend main navigation to see a list of all registered customer accounts. The list shows each customer's name, email address, registration date, and status. You can search and filter to find specific customers.

Click a customer to view their full profile, including:

- **Name and email** — The customer's display name and login email address.
- **Profile fields** — Extended profile information such as phone number, company name, and address details (provided by the RainLab.UserPlus plugin).
- **Status** — Whether the account is activated, banned, or pending verification.

## Customer Order History

When viewing a customer's profile, an **Orders** tab displays all orders placed by that customer, with the most recent orders shown first. This gives you a complete purchase history for each customer, which is useful for support inquiries and understanding buying patterns.

::: info
The Orders tab is added to the user profile automatically by Meloncart. It appears in the customer preview alongside the standard user profile tabs.
:::

## User Groups

User groups let you segment your customers for pricing, visibility, and tax purposes. Groups are managed under **Users → User Groups** in the backend.

Meloncart extends user groups with two additional settings:

- **Force Tax Exclusive Display** — When enabled, customers in this group always see prices without tax, regardless of the store's default tax display setting.
- **Tax Exempt** — When enabled, customers in this group are exempt from tax on all purchases.

User groups integrate with several Meloncart features:

| Feature | How Groups Are Used |
|---------|-------------------|
| **Price Tiers** | Each price tier can be restricted to a specific user group, allowing different volume pricing for wholesale vs. retail customers. |
| **Product Visibility** | Products can be restricted so only customers in certain groups can see them on the storefront. |
| **Cart Price Rules** | Discount rules can be limited to specific groups for member-exclusive promotions. |
| **Catalog Price Rules** | Catalog pricing can vary by group, with separate compiled prices for each group. |
| **Shipping Methods** | Shipping options can be restricted to certain customer groups. |
| **Tax Settings** | Groups can be marked as tax exempt or forced to see tax-exclusive prices. |

### Creating a User Group

To create a new user group, navigate to **Users → User Groups** and click **New Group**. Enter a name and code for the group, then configure the tax-related checkboxes as needed.

After creating the group, assign customers to it by editing their user profile and selecting the group under the **Groups** tab.

## Deleting Customers

Meloncart prevents the deletion of customer accounts that have associated orders. This safeguard ensures that order records maintain their customer reference for accounting and reporting purposes.

If you need to deactivate a customer who has placed orders, use the **Ban** feature instead of deleting. Banned customers cannot log in or place new orders, but their account and order history are preserved.

::: warning
Attempting to delete a customer who has placed orders will result in an error. The customer's order history must be preserved for data integrity.
:::

## Guest Checkout

Meloncart supports guest checkout, where customers can place orders without creating an account. During checkout, the system can optionally create a guest user account behind the scenes to maintain the customer-order relationship. This guest account can later be claimed by the customer if they choose to register.

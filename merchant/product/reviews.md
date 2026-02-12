---
subtitle: Manage product reviews and ratings from your customers.
---
# Reviews

The reviews system lets customers leave ratings and written feedback on products they have purchased. Reviews help build trust and provide social proof for potential buyers. You control whether reviews require approval before appearing on the storefront, and can approve, reject, or delete reviews at any time.

Navigate to **Shop → Reviews** to manage product reviews.

## Review List

The reviews list displays all submitted reviews with key details: the product, customer name, star rating, status, and whether the purchase is verified. Use the status filter at the top to quickly find pending, approved, or rejected reviews.

Reviews are sorted by date, with the most recent submissions appearing first.

## Review Statuses

Every review has one of three statuses:

- **Pending** — The review has been submitted but not yet moderated. Pending reviews are not visible on the storefront.
- **Approved** — The review has been approved and is visible on the storefront.
- **Rejected** — The review has been rejected and will not appear on the storefront.

When approval is required (the default), new reviews start with a Pending status. When approval is not required, reviews are automatically set to Approved on submission.

## Approving and Rejecting Reviews

You can moderate reviews individually or in bulk:

- **Individual** — Open a review and change the Status dropdown to Approved or Rejected, then save.
- **Bulk** — Select multiple reviews using the checkboxes in the list, then click the **Approve** or **Reject** button in the toolbar.

When a review's status changes, the product's cached rating and review count are automatically recalculated.

## Verified Purchases

When a customer submits a review, the system automatically checks whether they have purchased the product. If a paid order exists containing that product, the review is flagged as a **Verified Purchase**. This badge appears alongside the review on the storefront, helping other customers distinguish reviews from actual buyers.

You cannot manually set the verified purchase flag — it is determined automatically at submission time.

## Review Details

Each review contains the following information:

- **Product** — The product being reviewed (read-only).
- **Customer** — The user who submitted the review (read-only).
- **Rating** — A star rating from 1 to 5.
- **Title** — An optional short title for the review.
- **Review Content** — The main body of the review.
- **Helpful / Not Helpful Votes** — Vote counts from other customers (read-only). These are incremented when storefront visitors click helpful/not helpful buttons.

## Product Rating Aggregates

Each product maintains a cached average rating and total review count. These values update automatically whenever a review is approved, rejected, or deleted. The cached values are used on the storefront to display star ratings and review counts on product cards and detail pages without querying individual reviews.

## Review Settings

Navigate to **Settings → Review Settings** to configure the review system. The following options are available:

- **Allow Reviews** — Enable or disable the review system entirely. When disabled, the review submission form is hidden on the storefront and no new reviews can be submitted. Default: enabled.
- **Require Approval** — When enabled, new reviews start with a Pending status and must be approved by an administrator before appearing on the storefront. Default: enabled.
- **Require Login** — When enabled, only logged-in customers can submit reviews. Anonymous visitors will not see the review form. Default: enabled.
- **Require Purchase** — When enabled, only customers who have purchased the product can submit a review. The system checks for a paid order containing the product. Default: disabled.
- **Rating Required** — When enabled, a star rating is mandatory when submitting a review. Default: enabled.
- **Minimum Content Length** — The minimum number of characters required in the review content. Set to 0 for no minimum. Default: 0.

::: tip
For maximum review quality, enable both **Require Purchase** and **Require Approval**. This ensures that only actual buyers can submit reviews, and you can still filter out inappropriate content before it goes live.
:::

## Deleting Reviews

You can delete reviews individually from the edit form or in bulk using the list checkboxes and the **Delete Selected** button. Deleting a review permanently removes it and recalculates the product's rating aggregates.

::: warning
Deleted reviews cannot be recovered. If you want to hide a review without deleting it, use the Rejected status instead.
:::

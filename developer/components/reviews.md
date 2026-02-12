---
subtitle: Display and submit product reviews.
---
# Reviews

The `reviews` component provides product review functionality for your storefront. It handles displaying approved reviews, submitting new reviews, and voting on review helpfulness — all through AJAX handlers.

## Component Declaration

```ini
[reviews]
productId = "{{ :id }}"
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `productId` | `string` | The product to display reviews for. Accepts a baseid or primary key. Default: `{{ :id }}`. |

## Twig API

The following methods are available on the `reviews` component in your Twig templates.

### reviews.listReviews()

Returns a collection of approved reviews for the product, ordered by most recent first. Each review includes the `user` relationship.

```twig
{% for review in reviews.listReviews() %}
    <div class="review">
        <strong>{{ review.user.name }}</strong>
        <span>{{ review.rating }}/5</span>
        <p>{{ review.content }}</p>
    </div>
{% endfor %}
```

### reviews.averageRating()

Returns the cached average rating for the product as a float (0–5). This value is precalculated and stored on the product, so it does not query individual reviews.

```twig
<div class="average-rating">
    {{ reviews.averageRating() }} out of 5
</div>
```

### reviews.reviewsCount()

Returns the cached total number of approved reviews for the product.

```twig
<span>{{ reviews.reviewsCount() }} reviews</span>
```

### reviews.canReview()

Returns `true` if the current user is allowed to submit a review. This checks all configured restrictions:

- Reviews are enabled globally (via Review Settings).
- If login is required, the user is logged in.
- If purchase is required, the user has purchased this product.
- The user has not already reviewed this product.

```twig
{% if reviews.canReview() %}
    {# Show review form #}
{% else %}
    <p>You cannot submit a review for this product.</p>
{% endif %}
```

## AJAX Handlers

### onSubmitReview

Submits a new product review.

**POST Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `rating` | `int` | Star rating from 1 to 5. Required if ratings are required in settings. |
| `title` | `string` | Optional review title. |
| `content` | `string` | Review body text. Must meet the minimum content length if configured. |

**Behavior:**

- Validates that reviews are enabled and the user meets all requirements (login, purchase, no duplicate).
- Creates a new review with status **Pending** (if approval is required) or **Approved** (if not).
- Automatically sets the **Verified Purchase** flag if the user has a paid order containing this product.
- Updates the product's cached rating and review count (if auto-approved).
- Displays a success flash message.

**Error Conditions:**

- `"Reviews are not currently enabled."` — Reviews are disabled in settings.
- `"You must be logged in to submit a review."` — Login is required and user is not authenticated.
- `"Product not found."` — The product ID could not be resolved.
- `"You must purchase this product before submitting a review."` — Purchase is required and user has no paid orders with this product.
- `"You have already reviewed this product."` — The user has already submitted a review for this product.

```twig
<form data-request="reviews::onSubmitReview" data-request-flash>
    <div class="mb-3">
        <label>Rating</label>
        <select name="rating" required>
            <option value="">Select rating</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
        </select>
    </div>
    <div class="mb-3">
        <label>Title</label>
        <input type="text" name="title" />
    </div>
    <div class="mb-3">
        <label>Your Review</label>
        <textarea name="content" rows="4"></textarea>
    </div>
    <button type="submit" class="btn btn-primary">Submit Review</button>
</form>
```

### onVoteHelpful

Marks a review as helpful, incrementing its helpful vote count.

**POST Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `review_id` | `int` | The ID of the review to vote on. |

```twig
<button
    data-request="reviews::onVoteHelpful"
    data-request-data="review_id: {{ review.id }}"
>
    Helpful ({{ review.helpful_count }})
</button>
```

### onVoteNotHelpful

Marks a review as not helpful, incrementing its not-helpful vote count.

**POST Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `review_id` | `int` | The ID of the review to vote on. |

```twig
<button
    data-request="reviews::onVoteNotHelpful"
    data-request-data="review_id: {{ review.id }}"
>
    Not Helpful ({{ review.not_helpful_count }})
</button>
```

## Review Properties

Each review object in the collection returned by `listReviews()` has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `id` | `int` | Review primary key. |
| `title` | `string` | Review title. |
| `content` | `string` | Review body text. |
| `rating` | `int` | Star rating (1–5). |
| `status` | `string` | Review status: `pending`, `approved`, or `rejected`. |
| `is_verified_purchase` | `bool` | Whether the reviewer has purchased this product. |
| `helpful_count` | `int` | Number of helpful votes. |
| `not_helpful_count` | `int` | Number of not-helpful votes. |
| `user` | `User` | The user who submitted the review. |
| `created_at` | `Carbon` | When the review was submitted. |

## Complete Example

This example shows a full review section with average rating, review list, voting, and submission form.

```twig
[reviews]
productId = "{{ product.baseid }}"
==
<section class="product-reviews">
    <h3>Customer Reviews</h3>

    {# Rating summary #}
    <div class="review-summary mb-4">
        <strong>{{ reviews.averageRating()|number_format(1) }}</strong> out of 5
        <span class="text-muted">({{ reviews.reviewsCount() }} reviews)</span>
    </div>

    {# Review list #}
    {% set reviewList = reviews.listReviews() %}
    {% if reviewList is not empty %}
        {% for review in reviewList %}
            <div class="review border-bottom pb-3 mb-3">
                <div class="d-flex justify-content-between">
                    <div>
                        <strong>{{ review.user.name }}</strong>
                        {% if review.is_verified_purchase %}
                            <span class="badge bg-success">Verified Purchase</span>
                        {% endif %}
                    </div>
                    <span class="text-muted">{{ review.created_at|date('M d, Y') }}</span>
                </div>
                <div class="my-1">{{ review.rating }}/5 Stars</div>
                {% if review.title %}
                    <h5>{{ review.title }}</h5>
                {% endif %}
                <p>{{ review.content }}</p>
                <div class="review-votes">
                    <small>Was this review helpful?</small>
                    <button
                        class="btn btn-sm btn-outline-secondary"
                        data-request="reviews::onVoteHelpful"
                        data-request-data="review_id: {{ review.id }}"
                    >
                        Yes ({{ review.helpful_count }})
                    </button>
                    <button
                        class="btn btn-sm btn-outline-secondary"
                        data-request="reviews::onVoteNotHelpful"
                        data-request-data="review_id: {{ review.id }}"
                    >
                        No ({{ review.not_helpful_count }})
                    </button>
                </div>
            </div>
        {% endfor %}
    {% else %}
        <p class="text-muted">No reviews yet. Be the first to review this product.</p>
    {% endif %}

    {# Review form #}
    {% if reviews.canReview() %}
        <h4 class="mt-4">Write a Review</h4>
        <form data-request="reviews::onSubmitReview" data-request-flash>
            <div class="mb-3">
                <label class="form-label">Rating</label>
                <select name="rating" class="form-select" required>
                    <option value="">Select rating</option>
                    <option value="5">5 Stars - Excellent</option>
                    <option value="4">4 Stars - Good</option>
                    <option value="3">3 Stars - Average</option>
                    <option value="2">2 Stars - Poor</option>
                    <option value="1">1 Star - Terrible</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Title</label>
                <input type="text" name="title" class="form-control" />
            </div>
            <div class="mb-3">
                <label class="form-label">Your Review</label>
                <textarea name="content" class="form-control" rows="4"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Submit Review</button>
        </form>
    {% endif %}
</section>
```

::: tip
The reviews component is not included in the commerce theme's product page by default. To add reviews, include the component declaration on your product page and add the review markup wherever you want it to appear.
:::

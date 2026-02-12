---
subtitle: Manage user sessions and page access control.
---
# Session

The `session` component provides user session management for your storefront. It injects the authenticated user into the page, controls access to restricted pages, and handles logout functionality. This component comes from the **RainLab.User** plugin.

## Component Declaration

```ini
[session]
security = "all"
redirect = ""
```

### Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `security` | dropdown | `all` | Access restriction mode: `all`, `user`, or `guest` |
| `redirect` | dropdown | — | CMS page to redirect to when access is denied |

### Security Modes

| Mode | Description |
| --- | --- |
| `all` | Allow all visitors — no access restriction |
| `user` | Allow only logged-in users — guests are redirected |
| `guest` | Allow only guests — logged-in users are redirected |

## Twig API

### session.user()

Returns the authenticated `User` model, or `null` if the visitor is a guest.

```twig
{% if user %}
    <p>Welcome, {{ user.first_name }}!</p>
{% else %}
    <a href="{{ 'account/login'|page }}">Sign in</a>
{% endif %}
```

::: tip
The `session` component also injects the user as a `user` page variable, so you can reference `user` directly in templates without calling `session.user()`.
:::

### User Model Properties

The user object returned by `session.user()` provides the following properties in Twig:

| Property | Type | Description |
| --- | --- | --- |
| `id` | integer | User ID |
| `first_name` | string | First name |
| `last_name` | string | Last name |
| `full_name` | string | Concatenation of first and last name |
| `email` | string | Email address |
| `username` | string | Username |
| `login` | string | Login identifier (username or email, depending on configuration) |
| `phone` | string | Phone number |
| `company` | string | Company name |
| `city` | string | City |
| `zip` | string | Postal code |
| `avatar_url` | string | URL to avatar image or Gravatar |
| `is_banned` | boolean | Whether the user is banned |
| `last_seen` | Carbon | Last activity timestamp |
| `created_at` | Carbon | Registration timestamp |
| `email_verified_at` | Carbon\|null | When email was verified |
| `hasVerifiedEmail` | boolean | Whether email has been verified |
| `groups` | Collection | User groups the customer belongs to |
| `orders` | Collection | Customer's orders (added by Meloncart) |
| `addresses` | Collection | Saved addresses (added by RainLab.UserPlus) |

## AJAX Handlers

### onLogout

Logs the current user out and redirects to a specified page.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `redirect` | string | No | CMS page name or URL to redirect to after logout |

```html
<a href="javascript:;" data-request="onLogout">
    Logout
</a>
```

With a redirect:

```html
<a href="javascript:;"
    data-request="onLogout"
    data-request-data="{ redirect: '/' }">
    Logout
</a>
```

## Restricting Page Access

Use the `security` property to restrict who can view a page. When access is denied, the visitor is redirected to the page specified by the `redirect` property.

### Require Login

Restrict a page to logged-in customers only:

```ini
[session]
security = "user"
redirect = "account/login"
```

This is the most common pattern for account pages — profile, orders, addresses, and security settings all use this configuration.

### Guest Only

Restrict a page to guests only (redirect logged-in users away):

```ini
[session]
security = "guest"
redirect = "account/index"
```

Use this for login and registration pages so authenticated users are redirected to their account dashboard.

## Complete Example

The commerce theme uses the session component in most pages. Here is the account layout pattern showing how pages declare their access requirements.

### Account Sidebar with Logout

The account sidebar uses `onLogout` from the session component:

```twig
{# partials/account/sidebar.htm #}
<ul class="nav flex-column nav-pills">
    <li class="nav-item">
        <a
            class="nav-link {{ activeSubLink == 'index' ? 'active' }}"
            href="{{ 'account/index'|page }}">
            Profile Details
        </a>
    </li>
    <li class="nav-item">
        <a
            class="nav-link {{ activeSubLink == 'orders' ? 'active' }}"
            href="{{ 'account/orders'|page }}">
            My Orders
        </a>
    </li>
    <li class="nav-item">
        <a
            class="nav-link {{ activeSubLink == 'addresses' ? 'active' }}"
            href="{{ 'account/addresses'|page }}">
            My Addresses
        </a>
    </li>
    <li class="nav-item">
        <a
            class="nav-link {{ activeSubLink == 'security' ? 'active' }}"
            href="{{ 'account/security'|page }}">
            Account Security
        </a>
    </li>
    <li class="nav-item">
        <a
            class="nav-link"
            href="javascript:;"
            data-request="onLogout">
            Logout
        </a>
    </li>
</ul>
```

### Protected Account Page

A typical account page declares both the `session` component for access control and other components for page functionality:

```twig
##
url = "/account"
layout = "account"
title = "Account Homepage"

[session]
security = "user"
redirect = "account/login"

[account]
==
<div class="page-account">
    <h2>Profile Details</h2>
    {% if user %}
        <p>Hello, {{ user.full_name }}!</p>
        <p>Email: {{ user.email }}</p>
    {% endif %}
</div>
```

### Conditional Navigation

Show different navigation links based on login state:

```twig
{% if user %}
    <a href="{{ 'account/index'|page }}">My Account</a>
{% else %}
    <a href="{{ 'account/login'|page }}">Sign In</a>
{% endif %}
```

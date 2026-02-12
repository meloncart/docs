---
subtitle: Provides customer registration functionality.
---
# Registration

The `registration` component provides a customer registration form for your storefront. It handles account creation, validation, and automatic login after registration. This component comes from the **RainLab.User** plugin.

## Component Declaration

```ini
[registration]
```

The Registration component has no configurable properties. Add it to any page where customers can create new accounts.

## Twig API

### registration.canRegister()

Returns `true` if user registration is currently allowed. Registration can be disabled globally in the RainLab.User settings.

```twig
{% if registration.canRegister %}
    <a href="{{ 'account/register'|page }}">Create an account</a>
{% endif %}
```

## AJAX Handlers

### onRegister

Creates a new user account. On success, the user is automatically logged in and redirected.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `first_name` | string | Yes | Customer's first name (max 255 characters) |
| `last_name` | string | No | Customer's last name (max 255 characters) |
| `email` | string | Yes | Email address (must be unique) |
| `password` | string | Yes | Password (must meet strength requirements) |
| `password_confirmation` | string | No | Password confirmation (auto-filled if omitted) |
| `redirect` | string | No | CMS page name to redirect to after registration |

**Validation rules:**

- `first_name` — required, string, max 255 characters
- `email` — required, valid email, unique across non-guest users
- `password` — required, must meet the configured password strength rules

**Behavior:**

1. Validates all input fields
2. Creates a new User record
3. Automatically logs in the new user
4. Redirects to the specified page or the intended URL stored in the session

## Complete Example

### Registration Page

```twig
{# pages/account/register.htm #}
##
url = "/account/register"
layout = "default"
title = "Account Register"

[session]
security = "guest"
redirect = "account/index"

[registration]
==
<div class="page-account">
    <div class="py-4">
        <main class="form-login m-auto">
            <form method="post" data-request="onRegister" data-request-flash>
                <input type="hidden" name="redirect" value="account/index" />
                <div class="text-center pb-3">
                    <h1 class="h2 mb-3">Create a new account</h1>
                    <h2 class="h5 fw-normal">Enter your information below</h2>
                </div>

                <div class="form-floating my-3">
                    <input
                        name="first_name"
                        type="text"
                        class="form-control"
                        id="inputFirstName"
                        placeholder="First name"
                        autocomplete="given-name"
                    />
                    <label for="inputFirstName">First name</label>
                </div>

                <div class="form-floating my-3">
                    <input
                        name="last_name"
                        type="text"
                        class="form-control"
                        id="inputLastName"
                        placeholder="Last name"
                        autocomplete="family-name"
                    />
                    <label for="inputLastName">Last name</label>
                </div>

                <div class="form-floating my-3">
                    <input
                        name="email"
                        type="email"
                        class="form-control"
                        id="inputEmail"
                        placeholder="Email address"
                        autocomplete="email"
                    />
                    <label for="inputEmail">Email address</label>
                </div>

                <div class="form-floating my-3">
                    <input
                        name="password"
                        type="password"
                        class="form-control"
                        id="inputPassword"
                        placeholder="Password"
                        autocomplete="new-password"
                    />
                    <label for="inputPassword">Password</label>
                </div>

                <button
                    class="btn btn-primary btn-lg w-100 py-2"
                    data-attach-loading
                    type="submit">
                    Create account
                </button>

                <div class="text-center">
                    <p class="mt-5 mb-1 text-body-secondary">
                        Already have an account?
                        <a href="{{ 'account/login'|page }}">Sign in here</a>
                    </p>
                </div>
            </form>
        </main>
    </div>
</div>
```

::: tip
Pair the `registration` component with `[session] security = "guest"` to redirect already-logged-in users away from the registration page.
:::

### Guest Checkout Registration

During checkout, Meloncart can register a guest customer automatically. See the [Checkout](./checkout) component's guest registration parameters (`register_user`, `register_password`) for details.

## Events

The following events are fired during registration:

- `rainlab.user.beforeRegister` — Before the user record is created. Return a User model to override the default creation logic.
- `rainlab.user.register` — After the user is created and logged in. Return a response to override the default redirect.

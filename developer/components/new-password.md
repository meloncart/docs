---
subtitle: Confirms and resets the user with a new password.
---
# New Password

The `resetPassword` component handles password resets via email token and password changes for logged-in users. It serves as the landing page for password reset links and also provides an inline password change form for the account profile. This component comes from the **RainLab.User** plugin.

## Component Declaration

```ini
[resetPassword]
isDefault = 1
```

### Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `isDefault` | checkbox | `0` | Use this page as the default entry point for password recovery links |

::: tip
Set `isDefault = 1` on the page that should receive password reset links from emails. Only one page should have this property enabled.
:::

## Twig API

### resetPassword.canReset()

Returns `true` if the user can reset their password. This is true when either a valid reset token is present in the URL or the user is logged in.

```twig
{% if not resetPassword.canReset %}
    {% do abort(404) %}
{% endif %}
```

### resetPassword.hasToken()

Returns `true` if a password reset token is present in the URL query string (via the `reset` parameter). This indicates the user arrived from a password reset email.

### resetPassword.hasInvite()

Returns `true` if the `new` query parameter is set. This indicates the user arrived from an account invitation email and needs to set their initial password.

### resetPassword.token()

Returns the reset token value from the `reset` query parameter.

### resetPassword.email()

Returns the email address from the `email` query parameter.

### resetPassword.user()

Returns the logged-in User model, or `null` if the visitor is a guest.

## AJAX Handlers

### onResetPassword

Resets the user's password using a token from a password reset email. This handler is used when the user arrives via a reset link.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `token` | string | Yes | Bearer token from the password reset email |
| `email` | string | Yes | Email address associated with the account |
| `password` | string | Yes | New password |
| `password_confirmation` | string | Yes | New password confirmation |
| `redirect` | string | No | Page to redirect to after reset |

**Behavior:**

1. Validates the token against the password broker
2. Validates the new password meets strength requirements
3. Updates the user's password
4. Automatically logs in the user
5. Redirects to the specified page

### onChangePassword

Changes the password for a logged-in user. This handler is used on the account profile page.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `current_password` | string | Yes | User's current password for verification |
| `password` | string | Yes | New password |
| `password_confirmation` | string | Yes | New password confirmation |
| `redirect` | string | No | Page to redirect to after change |

**Behavior:**

1. Verifies the current password matches
2. Validates the new password meets strength requirements
3. Updates the user's password
4. Updates the session with the new password hash (so the user stays logged in)

## Complete Examples

### Password Reset / Change Page

The commerce theme uses a single page that handles three scenarios: password reset via token, account invitation, and password change for logged-in users. The correct handler is selected based on the URL parameters.

```twig
{# pages/account/password.htm #}
##
url = "/account/password"
layout = "default"
title = "New Password"

[resetPassword]
isDefault = 1
==
{% if not resetPassword.canReset %}
    {% do abort(404) %}
{% endif %}

{% if resetPassword.hasInvite %}
    {% set passwordHandler = 'onConfirmPassword' %}
{% elseif resetPassword.hasToken %}
    {% set passwordHandler = 'onResetPassword' %}
{% else %}
    {% set passwordHandler = 'onChangePassword' %}
{% endif %}

<div class="page-account">
    <div class="py-4">
        <main class="form-login m-auto">

            <form method="post" data-request="{{ passwordHandler }}" data-request-flash>
                <div class="text-center pb-3">
                    {% if resetPassword.hasInvite %}
                        <h1 class="h2 mb-3">Welcome!</h1>
                    {% elseif resetPassword.hasToken %}
                        <h1 class="h2 mb-3">Reset password</h1>
                    {% else %}
                        <h1 class="h2 mb-3">Change password</h1>
                    {% endif %}
                    <h2 class="h5 fw-normal">Enter a new password.</h2>
                </div>

                {% if resetPassword.hasToken %}
                    <input type="hidden" name="redirect" value="{{ 'account/login'|page }}" />
                    <input type="hidden" name="token" value="{{ resetPassword.token }}" />
                    <input type="hidden" name="email" value="{{ resetPassword.email }}" />
                {% else %}
                    <input type="hidden" name="redirect" value="{{ 'account/index'|page }}" />
                    <div class="form-floating my-3">
                        <input
                            name="current_password"
                            type="password"
                            class="form-control"
                            id="inputCurrentPassword"
                            placeholder="Current Password"
                        />
                        <label for="inputCurrentPassword">Current password</label>
                    </div>
                {% endif %}

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

                <div class="form-floating my-3">
                    <input
                        name="password_confirmation"
                        type="password"
                        class="form-control"
                        id="inputPasswordConfirmation"
                        placeholder="Confirm Password"
                        autocomplete="new-password"
                    />
                    <label for="inputPasswordConfirmation">Confirm password</label>
                </div>

                <button
                    class="btn btn-primary btn-lg w-100 py-2"
                    data-attach-loading
                    type="submit">
                    {% if resetPassword.hasInvite %}
                        Set password
                    {% else %}
                        Reset password
                    {% endif %}
                </button>
            </form>

        </main>
    </div>
</div>
```

### Inline Password Change

The account profile page uses `onChangePassword` in a collapsible editor partial:

```twig
{# partials/account/field-password.htm #}
{% set collapseClass = 'password-collapse' %}
<form
    method="post"
    class="account-editor"
    data-request="onChangePassword"
    data-request-update="{ _self: true }"
    data-request-flash>

    <div class="section-title border-bottom d-flex">
        <h5 class="h4 flex-grow-1">Password</h5>
        <button
            type="button"
            class="btn btn-outline-secondary btn-sm"
            data-bs-toggle="collapse"
            data-bs-target=".{{ collapseClass }}">
            Edit
        </button>
    </div>

    <div class="editor-view collapse show {{ collapseClass }}">
        <div class="d-flex">
            <label class="text-success flex-grow-1">Your password</label>
            <div class="field-value">********</div>
        </div>
    </div>

    <div class="editor-edit collapse {{ collapseClass }}">
        <div class="row">
            <div class="col-12 mb-2">
                <label class="form-label">Current password</label>
                <input
                    name="current_password"
                    type="password"
                    class="form-control"
                />
            </div>
            <div class="col-12 mb-2">
                <label class="form-label">Create a new password</label>
                <input
                    name="password"
                    type="password"
                    class="form-control"
                />
            </div>
            <div class="col-12 mb-2">
                <label class="form-label">Confirm new password</label>
                <input
                    name="password_confirmation"
                    type="password"
                    class="form-control"
                />
            </div>
        </div>
        <div class="section-actions">
            <button
                class="btn btn-primary"
                data-attach-loading
                type="submit">
                Save
            </button>
            <button
                class="btn btn-link"
                data-bs-toggle="collapse"
                data-bs-target=".{{ collapseClass }}"
                type="reset">
                Cancel
            </button>
        </div>
    </div>
</form>
```

## Events

- `rainlab.user.passwordReset` — After a password is reset via token. Receives the user model.
- `rainlab.user.update` — After a password is changed for a logged-in user.

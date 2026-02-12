---
subtitle: Provides services for logging a user in.
---
# Authentication

The `authentication` component provides login, two-factor authentication, and password recovery functionality for your storefront. It manages the complete sign-in flow including rate limiting, remember-me sessions, and 2FA challenges. This component comes from the **RainLab.User** plugin.

## Component Declaration

```ini
[authentication]
rememberMe = "always"
twoFactorAuth = 1
recoverPassword = 1
```

### Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `rememberMe` | dropdown | `never` | Remember me behavior: `always`, `never`, or `ask` |
| `twoFactorAuth` | checkbox | `1` | Challenge users with 2FA if they have it configured |
| `recoverPassword` | checkbox | `1` | Allow password recovery by email |

### Remember Me Modes

| Mode | Description |
| --- | --- |
| `always` | Always persist the session across browser restarts |
| `never` | Never persist — session ends when browser closes |
| `ask` | Show a "Remember me" checkbox and let the user decide |

## Twig API

The following methods are available on the `authentication` component in your Twig templates.

### authentication.showLoginForm()

Returns `true` if the login form should be displayed. This is `false` when the user is in the middle of a 2FA challenge.

### authentication.showTwoFactorChallenge()

Returns `true` if the two-factor authentication challenge form should be displayed.

### authentication.showRememberMe()

Returns `true` if the "Remember me" checkbox should be shown (when `rememberMe` is set to `ask`).

### authentication.usePasswordRecovery()

Returns `true` if password recovery is enabled in the component properties.

### authentication.useTwoFactorAuth()

Returns `true` if two-factor authentication is enabled in the component properties.

### authentication.canRegister()

Returns `true` if user registration is allowed in the site settings.

## AJAX Handlers

### onLogin

Authenticates a user with email and password. If the user has 2FA enabled, the login is held and a 2FA challenge is presented instead.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `login` | string | Yes | Email address or username |
| `password` | string | Yes | User password |
| `remember` | any | No | If present and `rememberMe = "ask"`, persists the session |
| `redirect` | string | No | CMS page name to redirect to after login |

**Rate limiting:** Login attempts are limited to 5 per minute. Exceeding this limit returns a validation error.

**Behavior:**

1. Validates credentials against the user database
2. Checks if the user is banned or not activated
3. If 2FA is enabled for the user, stores the user in session and displays the 2FA challenge form
4. Otherwise, logs in the user and redirects

### onTwoFactorChallenge

Completes login by verifying a two-factor authentication code. The user must have already passed the initial `onLogin` step.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | string | Conditional | 6-digit code from authenticator app |
| `recovery_code` | string | Conditional | One-time recovery code (if authenticator is unavailable) |
| `redirect` | string | No | CMS page name to redirect to after verification |

One of `code` or `recovery_code` must be provided. If a recovery code is used, it is marked as consumed and cannot be reused.

### onRecoverPassword

Sends a password reset link to the user's email address.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `email` | string | Yes | Email address associated with the account |

**Behavior:**

1. Validates the email address
2. Looks up the user account
3. Sends a password reset email containing a secure token link
4. The link directs to the [New Password](./new-password) page

## Complete Examples

### Login Page

The commerce theme implements a login page with collapsible sections for the login form and password recovery form, plus a conditional 2FA challenge:

```twig
{# pages/account/login.htm #}
##
url = "/account/login"
layout = "default"
title = "Account Login"

[authentication]
rememberMe = "always"

[session]
security = "guest"
redirect = "account/index"
==
<div class="page-account">
    <div class="py-4">
        <main class="form-login m-auto">

            {% if authentication.showLoginForm %}
                <div class="collapse show login-collapse">
                    {% partial 'account/login-form' %}

                    <div class="text-center">
                        <p class="mt-5 mb-1 text-body-secondary">
                            New user?
                            <a href="{{ 'account/register'|page }}">
                                Create a new account
                            </a>
                        </p>

                        {% if authentication.usePasswordRecovery %}
                            <p class="mt-1 mb-3 text-body-secondary">
                                Lost password?
                                <a
                                    href="javascript:;"
                                    data-bs-toggle="collapse"
                                    data-bs-target=".login-collapse">
                                    Recover password
                                </a>
                            </p>
                        {% endif %}
                    </div>
                </div>
            {% endif %}

            {% if authentication.usePasswordRecovery %}
                <div class="collapse login-collapse">
                    {% partial 'account/login-recovery-form' %}

                    <div class="text-center">
                        <p class="mt-5 mb-3 text-body-secondary">
                            Remembered your password?
                            <a
                                href="javascript:;"
                                data-bs-toggle="collapse"
                                data-bs-target=".login-collapse">
                                Sign in again
                            </a>
                        </p>
                    </div>
                </div>
            {% endif %}

            {% if authentication.showTwoFactorChallenge %}
                {% partial 'account/login-two-factor-form' %}
            {% endif %}
        </main>
    </div>
</div>
```

### Login Form Partial

```twig
{# partials/account/login-form.htm #}
<form method="post" data-request="onLogin" data-request-flash>
    <input type="hidden" name="redirect" value="account/index" />

    <div class="text-center pb-3">
        <h1 class="h2 mb-3">Sign in to your account</h1>
        <h2 class="h5 fw-normal">Enter your email address and password</h2>
    </div>

    <div class="form-floating my-3">
        <input
            name="email"
            type="email"
            class="form-control"
            id="inputEmail"
            placeholder="name@example.com"
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
        />
        <label for="inputPassword">Password</label>
    </div>

    <button
        class="btn btn-primary btn-lg w-100 py-2"
        data-attach-loading
        type="submit">
        Sign in
    </button>

    {% if authentication.showRememberMe %}
        <div class="text-center my-3">
            <div class="form-check form-check-inline">
                <input
                    name="remember"
                    type="checkbox"
                    class="form-check-input"
                    id="inputRemember"
                />
                <label class="form-check-label" for="inputRemember">
                    Remember me
                </label>
            </div>
        </div>
    {% endif %}
</form>
```

### Password Recovery Form Partial

```twig
{# partials/account/login-recovery-form.htm #}
<form method="post" data-request="onRecoverPassword" data-request-flash>
    <input type="hidden" name="redirect" value="account/login" />

    <div class="text-center pb-3">
        <h1 class="h2 mb-3">Recover password</h1>
        <h2 class="h5 fw-normal">Enter your email address</h2>
    </div>

    <div class="form-floating my-3">
        <input
            name="email"
            type="email"
            class="form-control"
            id="inputRecoverEmail"
            placeholder="name@example.com"
        />
        <label for="inputRecoverEmail">Email address</label>
    </div>

    <button
        class="btn btn-primary btn-lg w-100 py-2"
        data-attach-loading
        type="submit">
        Recover
    </button>
</form>
```

### Two-Factor Challenge Partial

The 2FA form toggles between an authenticator code input and a recovery code input:

```twig
{# partials/account/login-two-factor-form.htm #}
<div class="collapse show two-factor-collapse">
    <form method="post" data-request="onTwoFactorChallenge" data-request-flash>
        <input type="hidden" name="redirect" value="account/index" />

        <div class="text-center pb-2">
            <h1 class="h2 mb-3">Enter the code found in your authenticator app</h1>
        </div>

        <div class="form-floating my-3">
            <input
                name="code"
                type="text"
                class="form-control"
                id="inputTwoFactorCode"
                placeholder="Authentication code"
            />
            <label for="inputTwoFactorCode">Authentication code</label>
        </div>

        <button
            class="btn btn-primary btn-lg w-100 py-2"
            data-attach-loading
            type="submit">
            Confirm
        </button>
    </form>

    <div class="text-center">
        <p class="mt-5 mb-3 text-body-secondary">
            Lost device?
            <a
                href="javascript:;"
                data-bs-toggle="collapse"
                data-bs-target=".two-factor-collapse">
                Use a recovery code
            </a>
        </p>
    </div>
</div>

<div class="collapse two-factor-collapse">
    <form method="post" data-request="onTwoFactorChallenge" data-request-flash>
        <input type="hidden" name="redirect" value="account/index" />

        <div class="text-center pb-2">
            <h1 class="h2 mb-3">Enter one of your emergency recovery codes</h1>
        </div>

        <div class="form-floating my-3">
            <input
                name="recovery_code"
                type="text"
                class="form-control"
                id="inputTwoFactorRecoveryCode"
                placeholder="Recovery code"
            />
            <label for="inputTwoFactorRecoveryCode">Recovery code</label>
        </div>

        <button
            class="btn btn-primary btn-lg w-100 py-2"
            data-attach-loading
            type="submit">
            Confirm
        </button>
    </form>

    <div class="text-center">
        <p class="mt-5 mb-3 text-body-secondary">
            Found device?
            <a
                href="javascript:;"
                data-bs-toggle="collapse"
                data-bs-target=".two-factor-collapse">
                Use an authentication code
            </a>
        </p>
    </div>
</div>
```

## Events

The following events are fired during authentication:

- `rainlab.user.beforeAuthenticate` — Before the user is logged in. Receives the user model.
- `rainlab.user.authenticate` — After the user is logged in. Return a response to override the default redirect.
- `rainlab.user.logout` — When the user logs out.

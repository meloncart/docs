---
subtitle: Manages user security tools.
---
# Security Details

The `account` component also provides security management functionality — two-factor authentication (2FA) setup, browser session management, and account deletion. These handlers are part of the same `account` component used for [Profile Details](./profile-details), documented separately here for clarity.

This component comes from the **RainLab.User** plugin.

## Component Declaration

```ini
[account]
```

The security features require no additional properties beyond the standard `account` component declaration. See [Profile Details](./profile-details) for the full component properties.

## Twig API

### account.twoFactorEnabled()

Returns `true` if the user has two-factor authentication enabled and confirmed.

```twig
<p>Status: {{ account.twoFactorEnabled ? 'Enabled' : 'Disabled' }}</p>
```

### account.twoFactorRecoveryCodes()

Returns an array of unused recovery codes for the user's 2FA setup. These are single-use codes that can be used to access the account if the authenticator device is lost.

```twig
{% for code in account.twoFactorRecoveryCodes %}
    <li><code>{{ code }}</code></li>
{% endfor %}
```

### account.sessions()

Returns an array of browser sessions for the current user. Each session object contains:

| Property | Type | Description |
| --- | --- | --- |
| `agent.platform` | string | Operating system (e.g., "Windows", "macOS") |
| `agent.browser` | string | Browser name (e.g., "Chrome", "Firefox") |
| `agent.is_desktop` | boolean | Whether the session is from a desktop device |
| `ip_address` | string | IP address of the session |
| `is_current_device` | boolean | Whether this is the current session |
| `last_active` | string | Human-readable time since last activity |

## AJAX Handlers

### Two-Factor Authentication

#### onEnableTwoFactor

Begins the 2FA setup process. Generates a TOTP secret and returns a QR code for the user to scan with their authenticator app.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `password` | string | Yes | User's current password for confirmation |

**Response:** Returns JSON containing the QR code SVG and recovery codes. The partial is updated to show the confirmation form.

#### onConfirmTwoFactor

Confirms 2FA setup by verifying a code from the authenticator app. This finalizes the 2FA configuration.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | string | Yes | 6-digit code from the authenticator app |

**Behavior:**

1. Validates the code against the temporary 2FA secret
2. Saves the secret permanently
3. Generates and saves recovery codes
4. Sets the `two_factor_confirmed_at` timestamp

#### onShowTwoFactorRecoveryCodes

Displays the user's existing recovery codes. Requires password confirmation for security.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `password` | string | Yes | User's current password for confirmation |

#### onRegenerateTwoFactorRecoveryCodes

Generates a new set of recovery codes, invalidating any previous codes.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `password` | string | Yes | User's current password for confirmation |

#### onDisableTwoFactor

Completely disables two-factor authentication for the user's account.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `password` | string | Yes | User's current password for confirmation |

**Behavior:**

1. Clears the 2FA secret
2. Clears all recovery codes
3. Clears the `two_factor_confirmed_at` timestamp

### Browser Sessions

#### onDeleteOtherSessions

Logs the user out of all other browser sessions across all devices. The current session remains active.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `password` | string | Yes | User's current password for confirmation |

### Account Deletion

#### onDeleteUser

Permanently deletes the user's account. The user is soft-deleted (data is retained but the account is deactivated) and logged out.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `password` | string | Yes | User's current password for confirmation |
| `redirect` | string | No | Page to redirect to after deletion |

::: warning
If the user has existing orders, the account will be soft-deleted rather than permanently removed, preserving order history and data integrity.
:::

## Complete Examples

### Security Page

```twig
{# pages/account/security.htm #}
##
url = "/account/security"
layout = "account"
title = "Account Security"

[session]
security = "user"
redirect = "account/login"

[account]
==
<div class="page-account">
    <h2 class="mb-4">Account Security</h2>

    <div class="mb-4">
        {% ajaxPartial 'account/field-two-factor-auth' %}
    </div>

    <div class="mb-4">
        {% ajaxPartial 'account/field-account-sessions' %}
    </div>

    <div>
        {% ajaxPartial 'account/field-account-delete' %}
    </div>
</div>
```

### Two-Factor Authentication Partial

This partial handles the full 2FA lifecycle — enabling with QR code, confirming with a code, viewing and regenerating recovery codes, and disabling:

```twig
{# partials/account/field-two-factor-auth.htm #}
{% set collapseClass = 'two-factor-auth-collapse' %}
{% set isVisible = showConfirmation or showRecoveryCodes %}
<div>
    <div class="section-title border-bottom d-flex">
        <h5 class="h4 flex-grow-1">Two factor authentication</h5>
        <button
            type="button"
            class="btn btn-outline-secondary btn-sm"
            data-bs-toggle="collapse"
            data-bs-target=".{{ collapseClass }}">
            Edit
        </button>
    </div>

    <div class="editor-view collapse {{ not isVisible ? 'show' }} {{ collapseClass }}">
        <div class="d-flex">
            <label class="text-success flex-grow-1">Status</label>
            <div class="field-value">
                {{ account.twoFactorEnabled ? 'Enabled' : 'Disabled' }}
            </div>
        </div>
    </div>

    <div class="editor-edit collapse {{ isVisible ? 'show' }} {{ collapseClass }}">
        {% if account.twoFactorEnabled %}
            {% if showRecoveryCodes %}
                <p>
                    Store these recovery codes in a secure password manager.
                    They are single-use codes that can be used to access your
                    account if your two factor authentication device is lost.
                </p>
                <ul class="list-group mb-3">
                    {% for code in account.twoFactorRecoveryCodes %}
                        <li class="list-group-item"><code>{{ code }}</code></li>
                    {% endfor %}
                </ul>
                <button
                    class="btn btn-secondary"
                    data-attach-loading
                    data-request="onRegenerateTwoFactorRecoveryCodes"
                    data-request-update="{ _self: true }"
                    type="button">
                    Regenerate recovery codes
                </button>
            {% else %}
                <p>You have enabled two factor authentication.</p>
                <button
                    class="btn btn-secondary"
                    data-attach-loading
                    data-request="onShowTwoFactorRecoveryCodes"
                    data-request-update="{ _self: true }"
                    type="button">
                    Show recovery codes
                </button>
            {% endif %}
            <button
                class="btn btn-danger"
                data-attach-loading
                data-request="onDisableTwoFactor"
                data-request-confirm="Are you sure you want to disable two factor authentication?"
                data-request-update="{ _self: true }"
                type="button">
                Disable
            </button>

        {% else %}
            {% if showConfirmation %}
                <form
                    method="post"
                    data-request="onConfirmTwoFactor"
                    data-request-update="{ _self: true }"
                    data-request-flash>
                    <p>
                        To enable two factor authentication, scan the following
                        QR code using your phone's authenticator application
                        or enter the setup key and provide the generated OTP code.
                    </p>
                    <div class="row">
                        <div class="col-md-auto">
                            <div class="pb-3">
                                {{ user.twoFactorQrCodeSvg|raw }}
                            </div>
                        </div>
                        <div class="col-md-auto">
                            <h5 class="mb-3">
                                Setup key: {{ user.two_factor_secret }}
                            </h5>
                            <div class="row g-3 align-items-center">
                                <div class="col-auto">
                                    <label for="inputCode" class="col-form-label">
                                        Code
                                    </label>
                                </div>
                                <div class="col-auto">
                                    <input
                                        name="code"
                                        type="password"
                                        class="form-control"
                                        id="inputCode"
                                        autocomplete="one-time-code"
                                    />
                                </div>
                            </div>
                            <div class="section-actions">
                                <button
                                    class="btn btn-primary"
                                    data-attach-loading
                                    type="submit">
                                    Confirm
                                </button>
                                <button
                                    class="btn btn-secondary"
                                    data-attach-loading
                                    data-request="onAjax"
                                    data-request-update="{ _self: true }"
                                    type="button">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            {% else %}
                <p>You have not enabled two factor authentication.</p>
                <button
                    class="btn btn-secondary"
                    data-attach-loading
                    data-request="onEnableTwoFactor"
                    data-request-update="{ _self: true }"
                    type="button">
                    Enable
                </button>
            {% endif %}
        {% endif %}
    </div>
</div>
```

### Browser Sessions Partial

```twig
{# partials/account/field-account-sessions.htm #}
{% import _self as field %}
{% set collapseClass = 'account-sessions-collapse' %}
{% set sessions = account.sessions %}
{% set mySession = collect(sessions).where('is_current_device').first %}

{% if sessions %}
    <div>
        <div class="section-title border-bottom d-flex">
            <h5 class="h4 flex-grow-1">
                Browser sessions ({{ sessions|length }})
            </h5>
            <button
                type="button"
                class="btn btn-outline-secondary btn-sm"
                data-bs-toggle="collapse"
                data-bs-target=".{{ collapseClass }}">
                Edit
            </button>
        </div>

        <div class="editor-view collapse show {{ collapseClass }}">
            <div class="account-devices">
                {{ field.render_browser_session(mySession) }}
            </div>
        </div>

        <div class="editor-edit collapse {{ collapseClass }}">
            <div class="account-devices">
                {% for session in sessions %}
                    {{ field.render_browser_session(session) }}
                {% endfor %}
            </div>

            <div class="section-actions">
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-request="onAjax"
                    data-request-update="{
                        'account/popup-account-sessions': '#siteModalContent'
                    }"
                    data-bs-toggle="modal"
                    data-bs-target="#siteModal">
                    Log out other devices
                </button>
            </div>
        </div>
    </div>
{% endif %}

{% macro render_browser_session(session) %}
    <div class="device-item d-flex items-center">
        <div class="device-agent-icon text-muted">
            {% if session.agent.is_desktop %}
                <i class="bi bi-pc-display-horizontal"></i>
            {% else %}
                <i class="bi bi-phone"></i>
            {% endif %}
        </div>
        <div class="ms-3">
            <div>
                {{ session.agent.platform|default('Unknown') }} -
                {{ session.agent.browser|default('Unknown') }}
            </div>
            <div class="text-muted">
                {{ session.ip_address|default('0.0.0.0') }},
                {% if session.is_current_device %}
                    <strong class="text-success">This device</strong>
                {% else %}
                    Last active {{ session.last_active }}
                {% endif %}
            </div>
        </div>
    </div>
{% endmacro %}
```

### Account Deletion Partial

```twig
{# partials/account/field-account-delete.htm #}
<div class="account-editor">
    <div class="section-title border-bottom d-flex">
        <h5 class="h4 flex-grow-1">Delete account</h5>
        <button
            type="button"
            class="btn btn-outline-danger btn-sm"
            data-request="onAjax"
            data-request-update="{
                'account/popup-account-delete': '#siteModalContent'
            }"
            data-bs-toggle="modal"
            data-bs-target="#siteModal">
            Delete
        </button>
    </div>

    <div class="editor-view">
        <p>Your account will be deleted and your details removed from the site.</p>
    </div>
</div>
```

### Delete Confirmation Modal

```twig
{# partials/account/popup-account-delete.htm #}
<form
    method="post"
    class="modal-content"
    data-request="onDeleteUser"
    data-request-flash>

    <input type="hidden" name="redirect" value="index" />

    <div class="modal-header">
        <h5 class="modal-title h4">Delete account</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
    </div>
    <div class="modal-body">
        <p>
            Are you sure you want to permanently delete your account?
            Please enter your password to confirm.
        </p>
        <input
            name="password"
            type="password"
            class="form-control"
            placeholder="Password"
        />
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Cancel
        </button>
        <button class="btn btn-danger" data-attach-loading type="submit">
            Delete account
        </button>
    </div>
</form>
```

### Log Out Other Devices Modal

```twig
{# partials/account/popup-account-sessions.htm #}
<form
    method="post"
    class="modal-content"
    data-request="onDeleteOtherSessions"
    data-request-flash>

    <input type="hidden" name="redirect" value="true" />

    <div class="modal-header">
        <h5 class="modal-title h4">Log out of all other devices</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
    </div>
    <div class="modal-body">
        <p>
            Please enter your password to confirm you would like to
            log out of your other browser sessions across all of your devices.
        </p>
        <input
            name="password"
            type="password"
            class="form-control"
            placeholder="Password"
        />
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Cancel
        </button>
        <button class="btn btn-danger" data-attach-loading type="submit">
            Log out other devices
        </button>
    </div>
</form>
```

## Events

- `rainlab.user.twoFactorEnabled` — After 2FA is confirmed and enabled.
- `rainlab.user.twoFactorDisabled` — After 2FA is disabled.
- `rainlab.user.sessionDeleted` — After other browser sessions are logged out.
- `rainlab.user.deactivate` — After the user account is soft-deleted.

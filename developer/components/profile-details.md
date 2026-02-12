---
subtitle: Manages user profile and address book.
---
# Profile Details

The `account` component provides user profile management for your storefront. It handles updating profile fields like name, email, company, and phone. When paired with the `addressBook` component from **RainLab.UserPlus**, it also provides address book management for shipping and billing addresses.

The `account` component comes from the **RainLab.User** plugin. The `addressBook` component comes from the **RainLab.UserPlus** plugin.

## Component Declaration

```ini
[account]
isDefault = 1
```

### Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `isDefault` | checkbox | `0` | Use this page as the default entry point for email verification links |

## Twig API

### account.user()

Returns the authenticated `User` model, or `null` if the visitor is a guest. This is the same user object provided by the [Session](./session) component.

```twig
<p>Name: {{ user.first_name }} {{ user.last_name }}</p>
<p>Email: {{ user.email }}</p>
<p>Company: {{ user.company }}</p>
<p>Phone: {{ user.phone }}</p>
```

### addressBook.addresses()

Returns a collection of the user's saved addresses. Each address has the following properties:

| Property | Type | Description |
| --- | --- | --- |
| `id` | integer | Address ID |
| `first_name` | string | First name |
| `last_name` | string | Last name |
| `full_name` | string | Concatenated first and last name |
| `company` | string | Company name |
| `phone` | string | Phone number |
| `address_line1` | string | Street address line 1 |
| `address_line2` | string | Street address line 2 |
| `city` | string | City |
| `zip` | string | Postal / ZIP code |
| `state` | State | State/province relationship |
| `country` | Country | Country relationship |
| `is_business` | boolean | Business address flag |
| `is_default` | boolean | Default address flag |

### addressBook.hasAddresses()

Returns `true` if the user has any saved addresses.

### addressBook.useAddressBook()

Returns `true` if the address book feature is enabled in settings.

## AJAX Handlers

### onUpdateProfile

Updates the logged-in user's profile fields.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `first_name` | string | No | First name (max 255 characters) |
| `last_name` | string | No | Last name (max 255 characters) |
| `email` | string | No | Email address (must be unique) |
| `username` | string | No | Username (must be unique) |
| `phone` | string | No | Phone number |
| `company` | string | No | Company name |
| `city` | string | No | City |
| `zip` | string | No | Postal code |
| `state_id` | integer | No | State/province ID |
| `country_id` | integer | No | Country ID |
| `avatar` | file | No | Profile avatar image |
| `remove_avatar` | any | No | If present, removes the current avatar |
| `redirect` | string | No | Page to redirect to after update |

::: warning
Password cannot be changed through `onUpdateProfile`. Use the [New Password](./new-password) component's `onChangePassword` handler instead.
:::

### onVerifyEmail

Sends an email verification link to the user's current email address. This handler takes no parameters.

```html
<button
    data-request="onVerifyEmail"
    data-request-update="{ _self: true }"
    data-request-flash
    type="button">
    Verify Email
</button>
```

### onUpdateAddress

Creates, updates, or deletes an address in the user's address book. This handler comes from the `addressBook` component.

**Create a new address:**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `address_create` | any | Yes | Must be present to create a new address |
| `first_name` | string | No | First name |
| `last_name` | string | No | Last name |
| `company` | string | No | Company name |
| `address_line1` | string | Yes | Street address |
| `address_line2` | string | No | Additional address line |
| `city` | string | Yes | City |
| `zip` | string | Yes | Postal code |
| `state_id` | integer | No | State/province ID |
| `country_id` | integer | Yes | Country ID |
| `is_business` | boolean | No | Business address flag |
| `is_default` | boolean | No | Set as default address |

**Update an existing address:**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `address_id` | integer | Yes | ID of the address to update |
| (address fields) | — | — | Same fields as create |

**Delete an address:**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `address_id` | integer | Yes | ID of the address to delete |
| `address_delete` | any | Yes | Must be present to delete |

::: tip
When an address is marked as default (`is_default = true`), the user's profile is automatically updated with the address data (company, address, city, zip, state, country, phone).
:::

## Complete Examples

### Profile Page

The commerce theme profile page uses collapsible editor sections for each profile field:

```twig
{# pages/account/index.htm #}
##
url = "/account"
layout = "account"
title = "Account Homepage"

[session]
security = "user"
redirect = "account/login"

[account]
isDefault = 1

[resetPassword]
==
<div class="page-account">
    <h2 class="mb-4">Profile Details</h2>
    <div class="mb-4">
        {% ajaxPartial 'account/field-name' %}
    </div>
    <div class="mb-4">
        {% ajaxPartial 'account/field-email' %}
    </div>
    <div class="mb-4">
        {% ajaxPartial 'account/field-password' %}
    </div>
    <div>
        {% ajaxPartial 'account/field-profile' %}
    </div>
</div>
```

### Name Field Partial

Each profile field follows a view/edit pattern using Bootstrap collapse:

```twig
{# partials/account/field-name.htm #}
{% set collapseClass = 'name-collapse' %}
<form
    method="post"
    class="account-editor"
    data-request="onUpdateProfile"
    data-request-update="{ _self: true }"
    data-request-flash>

    <input type="hidden" name="message" value="false" />

    <div class="section-title border-bottom d-flex">
        <h5 class="h4 flex-grow-1">Name</h5>
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
            <label class="text-success flex-grow-1">Your real name</label>
            <div class="field-value">
                {{ user.first_name }} {{ user.last_name }}
            </div>
        </div>
    </div>

    <div class="editor-edit collapse {{ collapseClass }}">
        <div class="row">
            <div class="col-6">
                <input
                    name="first_name"
                    type="text"
                    value="{{ user.first_name }}"
                    class="form-control"
                    placeholder="First name"
                />
            </div>
            <div class="col-6">
                <input
                    name="last_name"
                    type="text"
                    value="{{ user.last_name }}"
                    class="form-control"
                    placeholder="Last name"
                />
            </div>
        </div>
        <div class="section-actions">
            <button class="btn btn-primary" data-attach-loading type="submit">
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

### Email Field with Verification

```twig
{# partials/account/field-email.htm #}
{% set collapseClass = 'email-collapse' %}
<form
    method="post"
    class="account-editor"
    data-request="onUpdateProfile"
    data-request-update="{ _self: true }"
    data-request-flash>

    <input type="hidden" name="message" value="false" />

    <div class="section-title border-bottom d-flex">
        <h5 class="h4 flex-grow-1">Email</h5>
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
            <label class="text-success flex-grow-1">Your email address</label>
            <div class="field-value">{{ user.email }}</div>
        </div>
        <div class="d-flex">
            <label class="text-success flex-grow-1">Status</label>
            <div class="field-value">
                {{ user.hasVerifiedEmail ? 'Verified' : 'Unverified' }}
            </div>
        </div>
    </div>

    <div class="editor-edit collapse {{ collapseClass }}">
        <div class="row">
            <div class="col-12">
                <input
                    name="email"
                    type="email"
                    value="{{ user.email }}"
                    class="form-control"
                    placeholder="Email address"
                />
            </div>
        </div>
        <div class="section-actions">
            <button class="btn btn-primary" data-attach-loading type="submit">
                Save
            </button>
            {% if not user.hasVerifiedEmail %}
                <button
                    class="btn btn-secondary"
                    data-attach-loading
                    data-request="onVerifyEmail"
                    data-request-update="{ _self: true }"
                    data-request-flash
                    type="button">
                    Verify Email
                </button>
            {% endif %}
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

### Profile Field (Company & Phone)

```twig
{# partials/account/field-profile.htm #}
{% set collapseClass = 'profile-collapse' %}
<form
    method="post"
    class="account-editor"
    data-request="onUpdateProfile"
    data-request-update="{ _self: true }"
    data-request-flash>

    <input type="hidden" name="message" value="false" />

    <div class="section-title border-bottom d-flex">
        <h5 class="h4 flex-grow-1">Profile</h5>
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
            <label class="text-success flex-grow-1">Your company name</label>
            <div class="field-value">{{ user.company }}</div>
        </div>
        <div class="d-flex">
            <label class="text-success flex-grow-1">Your phone number</label>
            <div class="field-value">{{ user.phone }}</div>
        </div>
    </div>

    <div class="editor-edit collapse {{ collapseClass }}">
        <div class="row">
            <div class="col-12 mb-2">
                <label class="form-label">Company name</label>
                <input
                    name="company"
                    type="text"
                    value="{{ user.company }}"
                    class="form-control"
                />
            </div>
            <div class="col-12 mb-2">
                <label class="form-label">Phone number</label>
                <input
                    name="phone"
                    type="text"
                    value="{{ user.phone }}"
                    class="form-control"
                />
            </div>
        </div>
        <div class="section-actions">
            <button class="btn btn-primary" data-attach-loading type="submit">
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

### Address Book Page

```twig
{# pages/account/addresses.htm #}
##
url = "/account/addresses"
layout = "account"
title = "Addresses"

[session]
security = "user"
redirect = "account/login"

[addressBook]
==
{% set hasAddresses = addressBook.hasAddresses %}
<div class="page-account">
    <div class="d-flex justify-content-between mb-4">
        <h2 class="mb-0">Address Book</h2>
        {% if hasAddresses %}
            <a
                href="javascript:;"
                class="btn btn-outline-primary"
                data-request="onAjax"
                data-request-update="{ 'account/popup-account-address': '#siteModalContent' }"
                data-bs-toggle="modal"
                data-bs-target="#siteModal">
                Add a new address
            </a>
        {% endif %}
    </div>
    <div class="row" id="accountAddressList">
        {% if hasAddresses %}
            {% partial 'account/address-list' %}
        {% else %}
            <div class="text-center">
                <p>No addresses yet</p>
                <a
                    href="javascript:;"
                    class="btn btn-outline-primary mt-2"
                    data-request="onAjax"
                    data-request-update="{ 'account/popup-account-address': '#siteModalContent' }"
                    data-bs-toggle="modal"
                    data-bs-target="#siteModal">
                    Add your first address
                </a>
            </div>
        {% endif %}
    </div>
</div>
```

### Address List Partial

```twig
{# partials/account/address-list.htm #}
{% for address in addressBook.addresses %}
    <div class="col-md-12 col-lg-6 col-xl-5 col-xxl-4 mb-3">
        <div class="card">
            <div class="card-body p-4">
                <p class="mb-3">
                    {{ address.full_name }}<br />
                    {{ address.address_line1 }}<br />
                    {{ address.city }}, {{ address.state.name }}<br />
                    {{ address.country.name }} {{ address.zip }}
                </p>
                {% if address.is_default %}
                    <span class="badge bg-primary">Default address</span>
                {% else %}
                    <a
                        href="javascript:;"
                        data-request="onUpdateAddress"
                        data-request-update="{ 'account/address-list': '#accountAddressList' }"
                        data-request-data="{ address_id: '{{ address.id }}', is_default: true }"
                        class="link-primary">
                        <small>Set as Default</small>
                    </a>
                {% endif %}
                <div class="mt-2">
                    <a
                        href="javascript:;"
                        class="text-inherit"
                        data-request="onAjax"
                        data-request-update="{ 'account/popup-account-address': '#siteModalContent' }"
                        data-request-data="{ address_id: '{{ address.id }}' }"
                        data-bs-toggle="modal"
                        data-bs-target="#siteModal">
                        <small>Edit</small>
                    </a>
                    <a
                        href="javascript:;"
                        data-request="onUpdateAddress"
                        data-request-confirm="Are you sure you want to delete this address?"
                        data-request-update="{ 'account/address-list': '#accountAddressList' }"
                        data-request-data="{ address_id: '{{ address.id }}', address_delete: true }"
                        class="text-danger ms-3">
                        <small>Delete</small>
                    </a>
                </div>
            </div>
        </div>
    </div>
{% endfor %}
```

### Address Form Modal

```twig
{# partials/account/popup-account-address.htm #}
<form
    method="post"
    class="modal-content"
    data-request="onUpdateAddress"
    data-request-update="{ 'account/address-list': '#accountAddressList' }"
    data-request-success="this.querySelector('[data-bs-dismiss]').click()"
    data-request-flash>

    {% set address = post('address_id')
        ? addressBook.addresses.find(post('address_id'))
        : null %}

    {% if address %}
        <input type="hidden" name="address_id" value="{{ address.id }}" />
    {% else %}
        <input type="hidden" name="address_create" value="true" />
    {% endif %}

    <div class="modal-header">
        <h5 class="modal-title h4">
            {{ address ? 'Update Address' : 'Add a New Address' }}
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
    </div>
    <div class="modal-body">
        <div class="row g-3">
            <div class="col-12">
                <input name="first_name" type="text" class="form-control"
                    placeholder="First name" value="{{ address.first_name }}" />
            </div>
            <div class="col-12">
                <input name="last_name" type="text" class="form-control"
                    placeholder="Last name" value="{{ address.last_name }}" />
            </div>
            <div class="col-12">
                <input name="company" type="text" class="form-control"
                    placeholder="Business Name" value="{{ address.company_name }}" />
            </div>
            <div class="col-12">
                <input name="address_line1" type="text" class="form-control"
                    placeholder="Address" value="{{ address.address_line1 }}" />
            </div>
            <div class="col-md-6">
                <input name="city" type="text" class="form-control"
                    placeholder="City" value="{{ address.city }}" />
            </div>
            <div class="col-md-6">
                <input name="zip" type="text" class="form-control"
                    placeholder="Zip / Postal Code" value="{{ address.zip }}" />
            </div>
            <div class="col-12">
                {% partial 'account/select-country' countryId=address.country_id %}
            </div>
            <div class="col-12">
                {% partial 'account/select-state' countryId=address.country_id stateId=address.state_id %}
            </div>
            <div class="col-12">
                <div class="form-check">
                    <input name="is_default" type="hidden" value="0" />
                    <input name="is_default" class="form-check-input" type="checkbox"
                        value="1" {{ address.is_default ? 'checked' }} />
                    <label class="form-check-label">Set as default address</label>
                </div>
            </div>
        </div>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button class="btn btn-success" data-attach-loading type="submit">Save Address</button>
    </div>
</form>
```

## Events

- `rainlab.user.beforeUpdate` — Before the user profile is updated.
- `rainlab.user.update` — After the user profile is updated.

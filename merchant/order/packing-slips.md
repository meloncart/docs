---
subtitle: Print packing slips for order fulfillment.
---
# Packing Slips

Packing slips are printable documents included with shipments that list the order contents without pricing information. They help warehouse staff verify items during packing and give customers a reference of what was shipped.

## Printing a Packing Slip

Open an order and click the **Print Packing Slip** button in the toolbar. A popup displays the rendered packing slip with a **Print** button that opens your browser's print dialog.

The packing slip is rendered using the default packing slip template. If no default template exists, you will see an error prompting you to create one in Settings.

## Packing Slip Templates

Navigate to **Settings → Packing Slip Templates** to manage your templates. A default template is created during installation.

### Creating a Template

Click **New Packing Slip Template** to create one. Each template has:

- **Name** — A descriptive name for the template (e.g., "Standard Packing Slip").
- **Code** — A unique identifier.
- **Is Default** — Whether this template is used when printing packing slips from order pages.

### Editing Template Content

Templates have two content tabs:

- **HTML** — The template markup, combining syntax fields and Twig variables.
- **CSS** — Print-friendly styles applied to the template.

After saving a template, any syntax fields defined in the HTML appear as editable form fields in the **Packing Slip** tab. This lets you customize values like your company name and address without editing the HTML directly.

### Syntax Fields

Syntax fields let you embed editable values directly in the template HTML. When a template is saved, these fields are extracted and presented as form fields.

```html
{text name="company_name" label="Company Name"}Company Name{/text}
```

The text between the tags is the default value. After saving, a "Company Name" text field appears in the Packing Slip tab where you can change it.

Common syntax field types:

| Type | Description |
|------|-------------|
| `{text}` | Single-line text input |
| `{textarea}` | Multi-line text input |
| `{richeditor}` | Rich text editor |
| `{fileupload}` | File upload (e.g., for a logo) |

<div v-pre>

### Twig Variables

Order data is available through Twig variables. These are populated dynamically when the packing slip is rendered for a specific order.

#### Order Object

| Variable | Description |
|----------|-------------|
| `{{ order.order_number }}` | Order number |
| `{{ order.ordered_at }}` | Order date |
| `{{ order.user_notes }}` | Customer notes |

#### Billing Address

| Variable | Description |
|----------|-------------|
| `{{ order.billing_first_name }}` | First name |
| `{{ order.billing_last_name }}` | Last name |
| `{{ order.billing_company }}` | Company name |
| `{{ order.billing_email }}` | Email address |
| `{{ order.billing_phone }}` | Phone number |
| `{{ order.billing_street_address }}` | Street address |
| `{{ order.billing_city }}` | City |
| `{{ order.billing_zip }}` | ZIP/postal code |
| `{{ order.billing_state.name }}` | State/province name |
| `{{ order.billing_country.name }}` | Country name |

#### Shipping Address

| Variable | Description |
|----------|-------------|
| `{{ order.shipping_first_name }}` | First name |
| `{{ order.shipping_last_name }}` | Last name |
| `{{ order.shipping_company }}` | Company name |
| `{{ order.shipping_phone }}` | Phone number |
| `{{ order.shipping_street_address }}` | Street address |
| `{{ order.shipping_city }}` | City |
| `{{ order.shipping_zip }}` | ZIP/postal code |
| `{{ order.shipping_state.name }}` | State/province name |
| `{{ order.shipping_country.name }}` | Country name |

#### Shipping Method

| Variable | Description |
|----------|-------------|
| `{{ order.shipping_method.name }}` | Shipping method name |
| `{{ order.shipping_child_option }}` | Selected child option (e.g., "Express") |

#### Order Items

Loop through items with `{% for item in order.items %}`:

| Variable | Description |
|----------|-------------|
| `{{ item.outputProductName({plainText: true}) }}` | Product name with options |
| `{{ item.product.sku }}` | Product SKU |
| `{{ item.quantity }}` | Quantity ordered |

#### CSS

| Variable | Description |
|----------|-------------|
| `{{ css }}` | The template's CSS content, for embedding in a `<style>` tag |

</div>

### Default Template

The default template includes:

- **Company header** — Company name and address (editable via syntax fields).
- **Packing slip number** — The order number.
- **Bill-to and Ship-to addresses** — Populated from the order's billing and shipping details.
- **Shipping method** — The selected shipping method and child option.
- **Items table** — Product name, SKU, and quantity for each order item.

The default CSS provides a print-friendly layout with a clean table format suitable for standard paper sizes.

### Example Template

```html
<html>
    <head>
        <style type="text/css" media="screen, print">
            {{ css }}
        </style>
    </head>
    <body>
        <div class="packing-slip">
            <h1>{text name="company_name" label="Company Name"}My Store{/text}</h1>

            <p>Packing Slip #{{ order.order_number }}</p>

            <h3>Ship To</h3>
            <p>
                {{ order.shipping_first_name }} {{ order.shipping_last_name }}<br>
                {{ order.shipping_street_address }}<br>
                {{ order.shipping_city }}, {{ order.shipping_state.name }} {{ order.shipping_zip }}
            </p>

            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>SKU</th>
                        <th>Qty</th>
                    </tr>
                </thead>
                <tbody>
                    {% for item in order.items %}
                        <tr>
                            <td>{{ item.outputProductName({plainText: true}) }}</td>
                            <td>{{ item.product.sku }}</td>
                            <td>{{ item.quantity }}</td>
                        </tr>
                    {% endfor %}
                </tbody>
            </table>
        </div>
    </body>
</html>
```

::: tip
Packing slips intentionally exclude pricing information. If you need a document with prices, use the invoice system provided by the Responsiv.Pay plugin.
:::

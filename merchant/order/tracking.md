---
subtitle: Add shipment tracking codes to orders.
---
# Tracking

Tracking codes let you record shipment information on orders and provide customers with links to track their deliveries. Each order can have multiple tracking codes, supporting scenarios where an order is shipped in multiple packages or through different carriers.

## Adding a Tracking Code

Open an order and navigate to the **Tracking** tab. Click **Add** to create a new tracking code with the following fields:

- **Carrier** — Select the shipping carrier from the dropdown:
  - **FedEx**
  - **UPS**
  - **USPS**
  - **DHL**
  - **Other** — For carriers not in the predefined list.
- **Tracking Number** — The tracking number provided by the carrier. This is a required field.
- **Shipped Date** — The date the shipment was sent. Use the date picker to select the date, or leave it empty if the shipment hasn't been dispatched yet.

Click **Create** to save the tracking code.

## Tracking URLs

For FedEx, UPS, USPS, and DHL, the system automatically generates a tracking URL from the tracking number. This URL links directly to the carrier's tracking page, making it easy for customers to check their shipment status.

| Carrier | Tracking URL Pattern |
|---------|---------------------|
| FedEx | `https://www.fedex.com/fedextrack/?trknbr={number}` |
| UPS | `https://www.ups.com/track?tracknum={number}` |
| USPS | `https://tools.usps.com/go/TrackConfirmAction?tLabels={number}` |
| DHL | `https://www.dhl.com/en/express/tracking.html?AWB={number}` |
| Other | No automatic URL generated |

When displaying tracking information on the storefront, your theme can use the generated URL to render clickable tracking links.

## Multiple Tracking Codes

An order can have any number of tracking codes. This is useful when:

- An order is split across multiple shipments.
- Different items ship from different warehouses.
- A replacement shipment is sent.

The tracking codes list shows all codes for the order, sorted by creation date with the most recent first.

## Shipped Status

An order is considered "shipped" when it has at least one tracking code. Your theme can use this to show a shipped indicator on the order detail page.

## Removing Tracking Codes

Select a tracking code in the list and click **Remove** to delete it. This permanently removes the tracking code from the order.

::: tip
Add tracking codes as soon as shipments are dispatched. If you send a status notification email to the customer (e.g., moving the order to a "Shipped" status), consider adding the tracking code first so the notification can include tracking details.
:::

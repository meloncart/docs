---
layout: doc
aside: false
---

<div class="mc-features-page">

<div class="mc-features-hero">
    <h1>Payments</h1>
    <p>Meloncart supports multiple payment methods out of the box, so you can offer customers the <strong>checkout experience</strong> that works best for your business.</p>
</div>

<div class="mc-detail-body">

<div class="mc-detail-section">
    <div class="mc-detail-section__text">
        <h2>Payment Gateways</h2>
        <p>Stripe and <strong>PayPal</strong> are included as built-in gateways — covering the vast majority of online transactions. Both support the full payment lifecycle: authorization, capture, <strong>refunds</strong> and voids, all manageable from the order screen.</p>
        <p>Additional gateways can be added through the Marketplace or by building your own using Meloncart's <strong>payment gateway API</strong>.</p>
    </div>
    <div class="mc-detail-section__visual">
        <div class="mc-mockup">
            <div class="mc-mockup__bar">
                <span></span><span></span><span></span>
            </div>
            <div class="mc-mockup__screen mc-mockup__screen--placeholder">
                <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                    <rect width="400" height="200" fill="#fafafa"/>
                    <!-- Header -->
                    <rect x="16" y="12" width="20" height="20" rx="4" fill="#e8f5e9"/>
                    <rect x="42" y="14" width="100" height="14" rx="3" fill="#e2e8f0"/>
                    <rect x="280" y="12" width="50" height="20" rx="4" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1"/>
                    <rect x="336" y="12" width="48" height="20" rx="4" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1"/>
                    <!-- Divider -->
                    <rect x="16" y="42" width="368" height="1" fill="#e2e8f0"/>
                    <rect x="16" y="50" width="30" height="8" rx="2" fill="#cbd5e1"/>
                    <!-- Stripe row -->
                    <rect x="16" y="68" width="24" height="24" rx="4" fill="#e2e8f0"/>
                    <rect x="48" y="70" width="50" height="10" rx="2" fill="#e2e8f0"/>
                    <rect x="48" y="84" width="120" height="8" rx="2" fill="#f1f5f9"/>
                    <rect x="330" y="70" width="54" height="20" rx="4" fill="#e8f5e9"/>
                    <!-- PayPal row -->
                    <rect x="16" y="104" width="368" height="1" fill="#f1f5f9"/>
                    <rect x="16" y="114" width="24" height="24" rx="4" fill="#e2e8f0"/>
                    <rect x="48" y="116" width="50" height="10" rx="2" fill="#e2e8f0"/>
                    <rect x="48" y="130" width="150" height="8" rx="2" fill="#f1f5f9"/>
                    <rect x="330" y="116" width="54" height="20" rx="4" fill="#e8f5e9"/>
                </svg>
            </div>
        </div>
    </div>
</div>

<div class="mc-detail-section">
    <div class="mc-detail-section__text">
        <h2>Alternative Payment Methods</h2>
        <p>Not every transaction goes through a card processor. Meloncart lets you configure custom payment methods for scenarios like:</p>
        <ul>
            <li><strong>Cash on delivery</strong> — collect payment when the order arrives</li>
            <li><strong>Bank transfer</strong> — provide account details and reconcile manually</li>
            <li><strong>Purchase orders / NET terms</strong> — support B2B and wholesale billing workflows</li>
            <li><strong>Check or money order</strong> — accept offline payments with manual confirmation</li>
        </ul>
        <p>Each method can be restricted to specific <strong>customer groups</strong>, so you can offer NET30 terms to wholesale accounts without exposing them to retail customers.</p>
    </div>
    <div class="mc-detail-section__visual">
        <div class="mc-mockup">
            <div class="mc-mockup__bar">
                <span></span><span></span><span></span>
            </div>
            <div class="mc-mockup__screen mc-mockup__screen--placeholder">
                <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
                    <rect width="400" height="240" fill="#fafafa"/>
                    <!-- Row 1: Cash on Delivery -->
                    <rect x="16" y="16" width="120" height="10" rx="2" fill="#e2e8f0"/>
                    <rect x="16" y="32" width="200" height="8" rx="2" fill="#f1f5f9"/>
                    <rect x="350" y="16" width="34" height="18" rx="9" fill="#006838"/>
                    <!-- Row 2: Bank Transfer -->
                    <rect x="16" y="58" width="368" height="1" fill="#f1f5f9"/>
                    <rect x="16" y="68" width="100" height="10" rx="2" fill="#e2e8f0"/>
                    <rect x="16" y="84" width="220" height="8" rx="2" fill="#f1f5f9"/>
                    <rect x="350" y="68" width="34" height="18" rx="9" fill="#006838"/>
                    <!-- Row 3: NET Terms -->
                    <rect x="16" y="108" width="368" height="1" fill="#f1f5f9"/>
                    <rect x="16" y="118" width="160" height="10" rx="2" fill="#e2e8f0"/>
                    <rect x="16" y="134" width="240" height="8" rx="2" fill="#f1f5f9"/>
                    <rect x="350" y="118" width="34" height="18" rx="9" fill="#e2e8f0"/>
                    <!-- Row 4: Check or Money Order -->
                    <rect x="16" y="158" width="368" height="1" fill="#f1f5f9"/>
                    <rect x="16" y="168" width="140" height="10" rx="2" fill="#e2e8f0"/>
                    <rect x="16" y="184" width="260" height="8" rx="2" fill="#f1f5f9"/>
                    <rect x="350" y="168" width="34" height="18" rx="9" fill="#e2e8f0"/>
                    <!-- Buttons -->
                    <rect x="16" y="210" width="368" height="1" fill="#e2e8f0"/>
                    <rect x="220" y="218" width="80" height="16" rx="4" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1"/>
                    <rect x="308" y="218" width="76" height="16" rx="4" fill="#006838"/>
                </svg>
            </div>
        </div>
    </div>
</div>

<div class="mc-detail-section">
    <div class="mc-detail-section__text">
        <h2>Configurable Order Flow</h2>
        <p>Define how orders move through your fulfillment process with configurable <strong>status routes</strong>. Set the initial status when an order is placed, then map out the transitions that match your workflow — for example: Pending, Processing, Shipped, Completed.</p>
        <p>Each status transition can trigger automatic <strong>actions</strong> like customer email notifications, and you can restrict which backend users see orders at each stage.</p>
    </div>
    <div class="mc-detail-section__visual">
        <div class="mc-mockup">
            <div class="mc-mockup__bar">
                <span></span><span></span><span></span>
            </div>
            <div class="mc-mockup__screen mc-mockup__screen--placeholder">
                <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                    <rect width="400" height="200" fill="#fafafa"/>
                    <!-- Header -->
                    <rect x="16" y="12" width="20" height="20" rx="4" fill="#e8f5e9"/>
                    <rect x="42" y="14" width="80" height="14" rx="3" fill="#e2e8f0"/>
                    <rect x="290" y="14" width="94" height="12" rx="3" fill="#e2e8f0"/>
                    <!-- Form fields -->
                    <rect x="16" y="44" width="60" height="8" rx="2" fill="#cbd5e1"/>
                    <rect x="16" y="58" width="14" height="14" rx="3" fill="#006838"/>
                    <rect x="36" y="60" width="160" height="10" rx="2" fill="#e2e8f0"/>
                    <rect x="16" y="82" width="60" height="8" rx="2" fill="#cbd5e1"/>
                    <rect x="16" y="96" width="14" height="14" rx="7" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1"/>
                    <rect x="36" y="98" width="80" height="10" rx="2" fill="#e2e8f0"/>
                    <!-- Tax line -->
                    <rect x="16" y="124" width="50" height="8" rx="2" fill="#e2e8f0"/>
                    <rect x="80" y="120" width="200" height="18" rx="4" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1"/>
                    <rect x="290" y="124" width="10" height="10" rx="5" fill="#e2e8f0"/>
                    <!-- Total -->
                    <rect x="16" y="152" width="368" height="1" fill="#e2e8f0"/>
                    <rect x="16" y="162" width="40" height="10" rx="2" fill="#cbd5e1"/>
                    <rect x="340" y="162" width="44" height="10" rx="2" fill="#e2e8f0"/>
                    <rect x="16" y="180" width="160" height="8" rx="2" fill="#f1f5f9"/>
                    <!-- Button -->
                    <rect x="310" y="176" width="74" height="18" rx="4" fill="#006838"/>
                </svg>
            </div>
        </div>
    </div>
</div>

<div class="mc-detail-section">
    <div class="mc-detail-section__text">
        <h2>Tax Calculation</h2>
        <p>Meloncart handles <strong>tax automatically</strong> based on the customer's location. Support for both tax-inclusive and tax-exclusive pricing models means you can configure your store to match your region's conventions. Multiple tax classes let you apply different rates to different product types — standard, reduced or zero-rated — and tax-exempt customer groups ensure B2B transactions are handled correctly.</p>
    </div>
    <div class="mc-detail-section__visual">
        <div class="mc-mockup">
            <div class="mc-mockup__bar">
                <span></span><span></span><span></span>
            </div>
            <div class="mc-mockup__screen mc-mockup__screen--placeholder">
                <svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg">
                    <rect width="400" height="260" fill="#fafafa"/>
                    <!-- Invoice header -->
                    <rect x="16" y="12" width="80" height="14" rx="3" fill="#e2e8f0"/>
                    <rect x="280" y="10" width="60" height="10" rx="2" fill="#cbd5e1"/>
                    <rect x="280" y="24" width="104" height="8" rx="2" fill="#e2e8f0"/>
                    <!-- Company details -->
                    <rect x="16" y="38" width="140" height="8" rx="2" fill="#f1f5f9"/>
                    <!-- Addresses -->
                    <rect x="16" y="58" width="60" height="8" rx="2" fill="#cbd5e1"/>
                    <rect x="200" y="58" width="60" height="8" rx="2" fill="#cbd5e1"/>
                    <rect x="16" y="72" width="100" height="8" rx="2" fill="#e2e8f0"/>
                    <rect x="200" y="72" width="80" height="8" rx="2" fill="#e2e8f0"/>
                    <rect x="16" y="86" width="120" height="8" rx="2" fill="#e2e8f0"/>
                    <rect x="200" y="86" width="100" height="8" rx="2" fill="#e2e8f0"/>
                    <rect x="16" y="100" width="80" height="8" rx="2" fill="#e2e8f0"/>
                    <rect x="200" y="100" width="70" height="8" rx="2" fill="#e2e8f0"/>
                    <!-- Table header -->
                    <rect x="16" y="122" width="368" height="1" fill="#e2e8f0"/>
                    <rect x="16" y="130" width="40" height="8" rx="2" fill="#cbd5e1"/>
                    <rect x="280" y="130" width="30" height="8" rx="2" fill="#cbd5e1"/>
                    <rect x="320" y="130" width="20" height="8" rx="2" fill="#cbd5e1"/>
                    <rect x="354" y="130" width="30" height="8" rx="2" fill="#cbd5e1"/>
                    <!-- Row 1 -->
                    <rect x="16" y="146" width="368" height="1" fill="#f1f5f9"/>
                    <rect x="16" y="154" width="14" height="14" rx="2" fill="#e2e8f0"/>
                    <rect x="36" y="156" width="160" height="8" rx="2" fill="#e2e8f0"/>
                    <rect x="280" y="156" width="30" height="8" rx="2" fill="#e2e8f0"/>
                    <rect x="320" y="156" width="20" height="8" rx="2" fill="#e2e8f0"/>
                    <rect x="354" y="156" width="30" height="8" rx="2" fill="#e2e8f0"/>
                    <!-- Row 2 -->
                    <rect x="16" y="174" width="368" height="1" fill="#f1f5f9"/>
                    <rect x="16" y="182" width="14" height="14" rx="2" fill="#e2e8f0"/>
                    <rect x="36" y="184" width="140" height="8" rx="2" fill="#e2e8f0"/>
                    <rect x="280" y="184" width="30" height="8" rx="2" fill="#e2e8f0"/>
                    <rect x="320" y="184" width="20" height="8" rx="2" fill="#e2e8f0"/>
                    <rect x="354" y="184" width="30" height="8" rx="2" fill="#e2e8f0"/>
                    <!-- Totals -->
                    <rect x="16" y="206" width="368" height="1" fill="#e2e8f0"/>
                    <rect x="280" y="214" width="50" height="8" rx="2" fill="#e2e8f0"/>
                    <rect x="354" y="214" width="30" height="8" rx="2" fill="#e2e8f0"/>
                    <rect x="280" y="230" width="30" height="8" rx="2" fill="#e2e8f0"/>
                    <rect x="354" y="230" width="30" height="8" rx="2" fill="#e2e8f0"/>
                    <!-- Buttons -->
                    <rect x="280" y="246" width="50" height="8" rx="2" fill="#e8f5e9"/>
                    <rect x="340" y="244" width="44" height="12" rx="3" fill="#e2e8f0"/>
                </svg>
            </div>
        </div>
    </div>
</div>

<div class="mc-detail-section">
    <div class="mc-detail-section__text">
        <h2>Invoices</h2>
        <p>Professional invoices are generated automatically with each order, branded with your company logo, registration <strong>numbers</strong> and contact details. Invoices support full and partial payment tracking, and update automatically when orders are edited.</p>
    </div>
    <div class="mc-detail-section__visual">
        <div class="mc-badge-row mc-badge-row--icons">
            <div class="mc-icon-badge mc-icon-badge--green">
                <svg width="24" height="24" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor"/></svg>
            </div>
            <div class="mc-icon-badge mc-icon-badge--blue">
                <svg width="24" height="24" viewBox="0 0 24 24"><path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6a5.87 5.87 0 01-2.8-.7l-1.46 1.46A7.93 7.93 0 0012 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46A7.93 7.93 0 0012 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z" fill="currentColor"/></svg>
            </div>
            <div class="mc-icon-badge mc-icon-badge--orange">
                <svg width="24" height="24" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/></svg>
            </div>
        </div>
    </div>
</div>

</div>

</div>

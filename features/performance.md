---
layout: doc
aside: false
---

<div class="mc-features-page">

<div class="mc-features-hero">
    <h1>Performance</h1>
    <p>Meloncart is built on <strong>Laravel's</strong> architecture, which means you get access to the full ecosystem of performance tooling — from caching and queues to database optimization — right out of the box.</p>
</div>

<div class="mc-detail-body">

<div class="mc-detail-section">
    <div class="mc-detail-section__text">
        <h2>Caching</h2>
        <p>Laravel's caching layer is available throughout your store. Cache product listings, category pages, navigation menus or any expensive query to reduce load times.</p>
        <p>Multiple cache drivers are supported, including <strong>Redis</strong>, Memcached, file-based caching and more. Use caching in your theme templates or in custom plugins to keep page responses fast, even as your catalog grows.</p>
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
                    <rect x="300" y="12" width="84" height="20" rx="4" fill="#006838"/>
                    <!-- Cache driver selector -->
                    <rect x="16" y="44" width="80" height="8" rx="2" fill="#cbd5e1"/>
                    <rect x="16" y="58" width="180" height="22" rx="4" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1"/>
                    <rect x="24" y="64" width="60" height="10" rx="2" fill="#e2e8f0"/>
                    <!-- Stats -->
                    <rect x="16" y="92" width="116" height="44" rx="6" fill="#f1f5f9"/>
                    <rect x="26" y="98" width="60" height="8" rx="2" fill="#cbd5e1"/>
                    <rect x="26" y="114" width="50" height="14" rx="3" fill="#e2e8f0"/>
                    <rect x="142" y="92" width="116" height="44" rx="6" fill="#f1f5f9"/>
                    <rect x="152" y="98" width="50" height="8" rx="2" fill="#cbd5e1"/>
                    <rect x="152" y="114" width="40" height="14" rx="3" fill="#e2e8f0"/>
                    <rect x="268" y="92" width="116" height="44" rx="6" fill="#f1f5f9"/>
                    <rect x="278" y="98" width="70" height="8" rx="2" fill="#cbd5e1"/>
                    <rect x="278" y="114" width="40" height="14" rx="3" fill="#e2e8f0"/>
                    <!-- Bar chart -->
                    <rect x="40" y="160" width="30" height="20" rx="2" fill="#e8f5e9"/>
                    <rect x="80" y="150" width="30" height="30" rx="2" fill="#e8f5e9"/>
                    <rect x="120" y="145" width="30" height="35" rx="2" fill="#006838"/>
                    <rect x="160" y="155" width="30" height="25" rx="2" fill="#e8f5e9"/>
                    <rect x="200" y="148" width="30" height="32" rx="2" fill="#e8f5e9"/>
                    <rect x="240" y="152" width="30" height="28" rx="2" fill="#e8f5e9"/>
                </svg>
            </div>
        </div>
    </div>
</div>

<div class="mc-detail-section">
    <div class="mc-detail-section__text">
        <h2>Built on Laravel</h2>
        <p>Meloncart inherits Laravel's performance characteristics: <strong>Eloquent ORM</strong> with eager loading to avoid N+1 queries, a robust queue system for offloading heavy tasks like email notifications and report generation, and route caching for fast request handling.</p>
    </div>
    <div class="mc-detail-section__visual">
        <div class="mc-badge-row mc-badge-row--icons">
            <div class="mc-icon-badge mc-icon-badge--green">
                <svg width="24" height="24" viewBox="0 0 24 24"><path d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 3.73-2.56 6.86-6 7.75v2.02c4.97-.93 8.75-5.3 8.75-9.77 0-4.83-3.44-8.87-8.75-9.95zm-2 0C6.05 3.03 2.25 7.4 2.25 12.18c0 4.47 3.78 8.84 8.75 9.77v-2.02c-3.44-.89-6-4.02-6-7.75 0-4.08 3.06-7.44 7-7.93V2.05zM12 8l-4 4h3v4h2v-4h3l-4-4z" fill="currentColor"/></svg>
            </div>
            <div class="mc-icon-badge mc-icon-badge--blue">
                <svg width="24" height="24" viewBox="0 0 24 24"><path d="M19.14 12.94a7.015 7.015 0 00.06-.94c0-.32-.02-.64-.06-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96a7.04 7.04 0 00-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84a.484.484 0 00-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.74 8.87a.49.49 0 00.12.61l2.03 1.58c-.04.3-.06.63-.06.94s.02.64.06.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.48-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 00-.12-.61l-2.03-1.58zM12 15.6A3.6 3.6 0 1115.6 12 3.611 3.611 0 0112 15.6z" fill="currentColor"/></svg>
            </div>
            <div class="mc-icon-badge mc-icon-badge--orange">
                <svg width="24" height="24" viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" fill="currentColor"/></svg>
            </div>
        </div>
    </div>
</div>

<div class="mc-detail-section">
    <div class="mc-detail-section__text">
        <h2>Scales with Your Catalog</h2>
        <p>Whether you're running a boutique store with a handful of products or a large catalog with thousands of SKUs, Meloncart is designed to handle the load.</p>
        <p>Pagination, lazy loading and efficient <strong>database queries</strong> keep the admin panel and storefront responsive as your inventory grows.</p>
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
                    <rect x="16" y="12" width="20" height="20" rx="10" fill="#e8f5e9"/>
                    <rect x="42" y="14" width="70" height="14" rx="3" fill="#e2e8f0"/>
                    <rect x="290" y="12" width="44" height="20" rx="4" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1"/>
                    <rect x="340" y="12" width="44" height="20" rx="4" fill="#006838"/>
                    <!-- Chart line trending up -->
                    <line x1="40" y1="150" x2="90" y2="140" stroke="#006838" stroke-width="2" fill="none"/>
                    <line x1="90" y1="140" x2="140" y2="130" stroke="#006838" stroke-width="2" fill="none"/>
                    <line x1="140" y1="130" x2="190" y2="110" stroke="#006838" stroke-width="2" fill="none"/>
                    <line x1="190" y1="110" x2="240" y2="95" stroke="#006838" stroke-width="2" fill="none"/>
                    <line x1="240" y1="95" x2="290" y2="80" stroke="#006838" stroke-width="2" fill="none"/>
                    <line x1="290" y1="80" x2="340" y2="65" stroke="#006838" stroke-width="2" fill="none"/>
                    <line x1="340" y1="65" x2="384" y2="55" stroke="#006838" stroke-width="2" fill="none"/>
                    <!-- X-axis -->
                    <rect x="16" y="162" width="368" height="1" fill="#e2e8f0"/>
                    <rect x="40" y="168" width="20" height="6" rx="1" fill="#f1f5f9"/>
                    <rect x="115" y="168" width="20" height="6" rx="1" fill="#f1f5f9"/>
                    <rect x="190" y="168" width="20" height="6" rx="1" fill="#f1f5f9"/>
                    <rect x="265" y="168" width="20" height="6" rx="1" fill="#f1f5f9"/>
                    <rect x="340" y="168" width="20" height="6" rx="1" fill="#f1f5f9"/>
                    <!-- Y-axis labels -->
                    <rect x="16" y="60" width="16" height="6" rx="1" fill="#f1f5f9"/>
                    <rect x="16" y="90" width="16" height="6" rx="1" fill="#f1f5f9"/>
                    <rect x="16" y="120" width="16" height="6" rx="1" fill="#f1f5f9"/>
                    <rect x="16" y="150" width="16" height="6" rx="1" fill="#f1f5f9"/>
                </svg>
            </div>
        </div>
    </div>
</div>

</div>

</div>

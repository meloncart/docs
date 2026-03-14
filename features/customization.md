---
layout: doc
aside: false
---

<div class="mc-features-page">

<div class="mc-features-hero">
    <h1>Customization</h1>
    <p>Meloncart gives you full control over your storefront code with <strong>unlimited flexibility</strong>.</p>
</div>

<div class="mc-detail-body">

<div class="mc-detail-hero-visual">
    <div class="mc-editor">
        <div class="mc-editor__bar">
            <span></span><span></span><span></span>
        </div>
        <div class="mc-editor__body" v-pre>
            <code><span class="mc-code-ln">1</span>  <span class="mc-code-tag">&lt;html&gt;</span></code>
            <code><span class="mc-code-ln">2</span>    <span class="mc-code-tag">&lt;head&gt;</span></code>
            <code><span class="mc-code-ln">3</span>      <span class="mc-code-tag">&lt;title&gt;</span><span class="mc-code-twig">{{ this.page.title }}</span><span class="mc-code-tag">&lt;/title&gt;</span></code>
            <code><span class="mc-code-ln">4</span>      <span class="mc-code-tag">&lt;link</span> <span class="mc-code-attr">rel=</span><span class="mc-code-str">"stylesheet"</span> <span class="mc-code-attr">href=</span><span class="mc-code-str">"assets/css/app.css"</span><span class="mc-code-tag">&gt;</span></code>
            <code><span class="mc-code-ln">5</span>    <span class="mc-code-tag">&lt;/head&gt;</span></code>
            <code><span class="mc-code-ln">6</span>    <span class="mc-code-tag">&lt;body&gt;</span></code>
            <code><span class="mc-code-ln">7</span>      <span class="mc-code-twig">{% component 'catalog' %}</span></code>
            <code><span class="mc-code-ln">8</span>    <span class="mc-code-tag">&lt;/body&gt;</span></code>
            <code><span class="mc-code-ln">9</span>  <span class="mc-code-tag">&lt;/html&gt;</span></code>
        </div>
    </div>
    <p class="mc-detail-hero-caption">Every line of HTML, CSS, and JavaScript is yours to write. No rigid templates, just pure flexibility.</p>
</div>

<div class="mc-detail-section">
    <div class="mc-detail-section__text">
        <h2>Theme-Driven Architecture</h2>
        <p>Define your store's design and behavior entirely in your CMS theme.</p>
    </div>
    <div class="mc-detail-section__visual">
        <div class="mc-badge-row">
            <div class="mc-badge">
                <svg width="28" height="28" viewBox="0 0 28 28"><path d="M14 3L2 25h24L14 3z" fill="#38bdf8"/></svg>
                <span>Tailwind CSS</span>
            </div>
            <div class="mc-badge">
                <svg width="28" height="28" viewBox="0 0 28 28"><rect x="6" y="4" width="16" height="20" rx="2" fill="#7952b3"/><text x="14" y="18" text-anchor="middle" font-size="14" font-weight="bold" fill="#fff">B</text></svg>
                <span>Bootstrap</span>
            </div>
            <div class="mc-badge">
                <svg width="28" height="28" viewBox="0 0 28 28"><polygon points="14,2 26,26 2,26" fill="#77c1d2" stroke="#4aa8c0" stroke-width="1"/><text x="14" y="21" text-anchor="middle" font-size="10" font-weight="bold" fill="#fff">A</text></svg>
                <span>Alpine.js</span>
            </div>
        </div>
    </div>
</div>

<div class="mc-detail-section">
    <div class="mc-detail-section__text">
        <h2>Start From Scratch or Use a Theme</h2>
        <p>Build from a blank slate or customize the <em>Fresh Theme</em> to fit your needs.</p>
    </div>
    <div class="mc-detail-section__visual">
        <div class="mc-mockup">
            <div class="mc-mockup__bar">
                <span></span><span></span><span></span>
            </div>
            <div class="mc-mockup__screen mc-mockup__screen--placeholder">
                <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                    <rect x="16" y="16" width="120" height="12" rx="3" fill="#e2e8f0"/>
                    <rect x="16" y="36" width="80" height="8" rx="2" fill="#e2e8f0"/>
                    <rect x="16" y="60" width="368" height="1" fill="#e2e8f0"/>
                    <rect x="16" y="76" width="100" height="24" rx="4" fill="#e2e8f0"/>
                    <rect x="124" y="76" width="100" height="24" rx="4" fill="#e2e8f0"/>
                    <rect x="232" y="76" width="100" height="24" rx="4" fill="#e2e8f0"/>
                    <rect x="16" y="116" width="176" height="68" rx="6" fill="#f1f5f9"/>
                    <rect x="208" y="116" width="176" height="68" rx="6" fill="#f1f5f9"/>
                </svg>
            </div>
        </div>
    </div>
</div>

<div class="mc-detail-section">
    <div class="mc-detail-section__text">
        <h2>Built-In Content Editing</h2>
        <p>Easily update page content in the visual editor — no developer needed.</p>
    </div>
    <div class="mc-detail-section__visual">
        <div class="mc-editor mc-editor--small">
            <div class="mc-editor__bar">
                <span></span><span></span><span></span>
            </div>
            <div class="mc-editor__body" v-pre>
                <code><span class="mc-code-ln">1</span>  <span class="mc-code-twig">{% content</span> <span class="mc-code-str">"welcome.htm"</span> <span class="mc-code-twig">%}</span></code>
                <code><span class="mc-code-ln">2</span>  <span class="mc-code-twig">{% component</span> <span class="mc-code-str">"productList"</span> <span class="mc-code-twig">%}</span></code>
                <code><span class="mc-code-ln">3</span>  <span class="mc-code-twig">{% partial</span> <span class="mc-code-str">"footer"</span> <span class="mc-code-twig">%}</span></code>
            </div>
        </div>
    </div>
</div>

<div class="mc-detail-section">
    <div class="mc-detail-section__text">
        <h2>A Clean API</h2>
        <p>Access products, categories, and orders with our powerful <strong>API</strong>.</p>
    </div>
    <div class="mc-detail-section__visual">
        <div class="mc-badge-row mc-badge-row--icons">
            <div class="mc-icon-badge mc-icon-badge--green">
                <svg width="24" height="24" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" fill="currentColor"/></svg>
            </div>
            <div class="mc-icon-badge mc-icon-badge--orange">
                <svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/></svg>
            </div>
            <div class="mc-icon-badge mc-icon-badge--blue">
                <svg width="24" height="24" viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" fill="currentColor"/></svg>
            </div>
        </div>
    </div>
</div>

<div class="mc-detail-section">
    <div class="mc-detail-section__text">
        <h2>Events &amp; Hooks</h2>
        <p>50+ event hooks to customize and extend store behavior.</p>
    </div>
    <div class="mc-detail-section__visual">
        <div class="mc-badge-row mc-badge-row--icons">
            <div class="mc-icon-badge mc-icon-badge--red">
                <svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/></svg>
            </div>
            <div class="mc-icon-badge mc-icon-badge--orange">
                <svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/></svg>
            </div>
            <div class="mc-icon-badge mc-icon-badge--green">
                <svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/></svg>
            </div>
            <div class="mc-icon-badge mc-icon-badge--blue">
                <svg width="24" height="24" viewBox="0 0 24 24"><path d="M19.14 12.94a7.015 7.015 0 00.06-.94c0-.32-.02-.64-.06-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96a7.04 7.04 0 00-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84a.484.484 0 00-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.74 8.87a.49.49 0 00.12.61l2.03 1.58c-.04.3-.06.63-.06.94s.02.64.06.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.48-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 00-.12-.61l-2.03-1.58zM12 15.6A3.6 3.6 0 1115.6 12 3.611 3.611 0 0112 15.6z" fill="currentColor"/></svg>
            </div>
            <div class="mc-icon-badge mc-icon-badge--teal">
                <svg width="24" height="24" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>
            </div>
        </div>
    </div>
</div>

<div class="mc-detail-section">
    <div class="mc-detail-section__text">
        <h2>Wishlist &amp; Save for Later</h2>
        <p>Built-in wishlists and save-for-later functionality.</p>
    </div>
    <div class="mc-detail-section__visual">
        <div class="mc-mockup">
            <div class="mc-mockup__bar">
                <span></span><span></span><span></span>
            </div>
            <div class="mc-mockup__screen mc-mockup__screen--placeholder">
                <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                    <rect x="16" y="16" width="90" height="12" rx="3" fill="#e2e8f0"/>
                    <rect x="16" y="40" width="176" height="72" rx="6" fill="#f1f5f9"/>
                    <rect x="208" y="40" width="176" height="72" rx="6" fill="#f1f5f9"/>
                    <rect x="16" y="124" width="176" height="60" rx="6" fill="#f1f5f9"/>
                    <rect x="208" y="124" width="176" height="60" rx="6" fill="#f1f5f9"/>
                    <rect x="28" y="52" width="60" height="48" rx="4" fill="#e2e8f0"/>
                    <rect x="96" y="52" width="84" height="8" rx="2" fill="#e2e8f0"/>
                    <rect x="96" y="66" width="60" height="6" rx="2" fill="#e2e8f0"/>
                    <rect x="220" y="52" width="60" height="48" rx="4" fill="#e2e8f0"/>
                    <rect x="288" y="52" width="84" height="8" rx="2" fill="#e2e8f0"/>
                    <rect x="288" y="66" width="60" height="6" rx="2" fill="#e2e8f0"/>
                </svg>
            </div>
        </div>
    </div>
</div>

<div class="mc-detail-section">
    <div class="mc-detail-section__text">
        <h2>Extend with Plugins</h2>
        <p>Add new features and integrations with powerful plugins.</p>
    </div>
    <div class="mc-detail-section__visual">
        <div class="mc-badge-row mc-badge-row--icons">
            <div class="mc-icon-badge mc-icon-badge--blue">
                <svg width="24" height="24" viewBox="0 0 24 24"><path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-2 .9-2 2v3.8h1.5c1.38 0 2.5 1.12 2.5 2.5S4.88 15.8 3.5 15.8H2V19c0 1.1.9 2 2 2h3.8v-1.5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5V21H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z" fill="currentColor"/></svg>
            </div>
            <div class="mc-icon-badge mc-icon-badge--green">
                <svg width="24" height="24" viewBox="0 0 24 24"><path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-2 .9-2 2v3.8h1.5c1.38 0 2.5 1.12 2.5 2.5S4.88 15.8 3.5 15.8H2V19c0 1.1.9 2 2 2h3.8v-1.5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5V21H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z" fill="currentColor"/></svg>
            </div>
            <div class="mc-icon-badge mc-icon-badge--orange">
                <svg width="24" height="24" viewBox="0 0 24 24"><path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-2 .9-2 2v3.8h1.5c1.38 0 2.5 1.12 2.5 2.5S4.88 15.8 3.5 15.8H2V19c0 1.1.9 2 2 2h3.8v-1.5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5V21H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z" fill="currentColor"/></svg>
            </div>
        </div>
    </div>
</div>

<div class="mc-detail-section">
    <div class="mc-detail-section__text">
        <h2>File-Based Templates &amp; Version Control</h2>
        <p>Edit with your favorite tools and manage with Git.</p>
    </div>
    <div class="mc-detail-section__visual">
        <div class="mc-badge-row mc-badge-row--icons">
            <div class="mc-icon-badge mc-icon-badge--blue">
                <svg width="24" height="24" viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" fill="currentColor"/></svg>
            </div>
            <div class="mc-icon-badge mc-icon-badge--green">
                <svg width="24" height="24" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor"/><rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor"/><rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor"/><rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor"/></svg>
            </div>
            <div class="mc-icon-badge mc-icon-badge--red">
                <svg width="24" height="24" viewBox="0 0 24 24"><path d="M21 5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5zm-4.5 12L12 14.5 7.5 17l1.2-5.1L5 8.9l5.2-.4L12 4l1.8 4.5 5.2.4-3.7 3L16.5 17z" fill="currentColor"/></svg>
            </div>
            <div class="mc-icon-badge mc-icon-badge--orange">
                <svg width="24" height="24" viewBox="0 0 24 24"><path d="M2.6 10.59L8.38 4.8l1.69 1.7c-.24.85.15 1.78.93 2.23v5.54c-.6.34-1 .99-1 1.73a2 2 0 002 2 2 2 0 002-2c0-.74-.4-1.39-1-1.73V9.41l1.35 1.36c-.03.13-.05.27-.05.41a2 2 0 002 2 2 2 0 002-2 2 2 0 00-2-2c-.14 0-.27.02-.41.05L13.93 8.26c.27-.62.2-1.37-.21-1.93l1.7-1.69L21.4 10.6a2 2 0 010 2.81L14.6 19.4a2 2 0 01-2.82 0l-5.58-5.59-.03-.03-.03-.03-.03-.03-.03-.03a2 2 0 01.12-2.1z" fill="currentColor"/></svg>
            </div>
        </div>
    </div>
</div>

</div>

</div>

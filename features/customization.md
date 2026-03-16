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
            <div class="mc-mockup__screen">
                <img src="/screenshots/customization-theme.png" alt="Fresh Theme storefront preview" />
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
        <div class="mc-mockup">
            <div class="mc-mockup__bar">
                <span></span><span></span><span></span>
            </div>
            <div class="mc-mockup__screen">
                <img src="/screenshots/editor-html.png" alt="Built-in content editing in the visual editor" />
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
        <img src="/features/feat-clean-api.png" alt="A clean API for products, categories and orders" />
    </div>
</div>

<div class="mc-detail-section">
    <div class="mc-detail-section__text">
        <h2>Events &amp; Hooks</h2>
        <p>50+ event hooks to customize and extend store behavior.</p>
    </div>
    <div class="mc-detail-section__visual">
        <img src="/features/feat-events-hooks.png" alt="Events and hooks system" />
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
        <img src="/features/feat-extend-plugins.png" alt="Extend with plugins" />
    </div>
</div>

<div class="mc-detail-section">
    <div class="mc-detail-section__text">
        <h2>File-Based Templates &amp; Version Control</h2>
        <p>Edit with your favorite tools and manage with Git.</p>
    </div>
    <div class="mc-detail-section__visual">
        <img src="/features/feat-file-templates.png" alt="File-based templates and version control" />
    </div>
</div>

</div>

</div>

---
title: Customization
description: Full control over your storefront. Write your own HTML, CSS and JavaScript, choose any frontend framework and customize every aspect of the shopping experience.
layout: doc
aside: false
---

<div class="mc-features-page">

<div class="mc-features-hero">
    <h1>Customization</h1>
    <p>Meloncart gives you full control over your storefront. Write your own HTML, CSS and JavaScript, choose any frontend framework and customize every aspect of the shopping experience.</p>
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
        <p>Your store's design and behavior are defined entirely in your CMS theme using pages, partials and layouts. There are no rigid templates to work around. Use any CSS framework, any JavaScript library and any markup structure you like.</p>
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
        <p>Build your storefront from a blank slate for complete creative control, or start with the included <strong>Fresh Theme</strong> and customize it to fit your needs. The Fresh Theme provides a fully working checkout, product catalog, customer accounts and more out of the box.</p>
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
        <p>Store owners can update page content, banners and static text directly from the admin panel without touching code. The built-in editor supports HTML and rich text, so day-to-day content changes don't require a developer.</p>
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
        <p>Access products, categories, orders and customers through a well-documented <strong>component API</strong>. Drop components into your theme templates and use Twig to render data exactly how you want it. The API is consistent and predictable, so building custom storefronts is straightforward.</p>
    </div>
    <div class="mc-detail-section__visual">
        <img src="/features/feat-clean-api.png" alt="A clean API for products, categories and orders" />
    </div>
</div>

<div class="mc-detail-section">
    <div class="mc-detail-section__text">
        <h2>Events and Hooks</h2>
        <p>Over 50 event hooks let you customize and extend store behavior from your own plugins. Intercept order placement, modify pricing calculations, adjust shipping rates, trigger external integrations and more without modifying core code.</p>
    </div>
    <div class="mc-detail-section__visual">
        <img src="/features/feat-events-hooks.png" alt="Events and hooks system" />
    </div>
</div>

<div class="mc-detail-section">
    <div class="mc-detail-section__text">
        <h2>Extend with Plugins</h2>
        <p>Add new features by building custom plugins or installing existing ones from the Marketplace. Plugins can add payment gateways, shipping providers, product types, admin pages, frontend components and anything else your store needs.</p>
    </div>
    <div class="mc-detail-section__visual">
        <img src="/features/feat-extend-plugins.png" alt="Extend with plugins" />
    </div>
</div>

<div class="mc-detail-section">
    <div class="mc-detail-section__text">
        <h2>File-Based Templates and Version Control</h2>
        <p>All theme files live on disk as plain HTML, CSS and JavaScript. Edit them with your favorite code editor, track changes with <strong>Git</strong> and deploy using your existing workflow. No database-driven templates or locked-in editors to work around.</p>
    </div>
    <div class="mc-detail-section__visual">
        <img src="/features/feat-file-templates.png" alt="File-based templates and version control" />
    </div>
</div>

</div>

</div>

const getStartedSidebar = [
    {
        text: "Get Started",
        items: [
            { text: 'Installation', link: '/get-started/installation' }
        ]
    }
];

const featuresSidebar = [
    {
        text: "Features",
        items: [
            { text: 'Overview', link: '/features/' },
            { text: 'Customization', link: '/features/customization' },
            { text: 'Product Management', link: '/features/product-management' },
            { text: 'Customer Management', link: '/features/customer-management' },
            { text: 'Order Management', link: '/features/order-management' },
            { text: 'Payments', link: '/features/payments' },
            { text: 'Shipping', link: '/features/shipping' },
            { text: 'Checkout', link: '/features/checkout' },
            { text: 'Marketing & Promotion', link: '/features/marketing' },
            { text: 'Reporting & Analytics', link: '/features/reporting' },
            { text: 'Software Updates', link: '/features/updates' },
            { text: 'Security', link: '/features/security' },
            { text: 'Performance', link: '/features/performance' },
            { text: 'Customer Support', link: '/features/support' },
            { text: 'Multi-Store', link: '/features/multi-store' },
            { text: 'Marketplace', link: '/features/marketplace' }
        ]
    }
];

const merchantSidebar = [
    {
        text: "Getting Started",
        items: [
            { text: 'Introduction', link: '/merchant/introduction' }
        ]
    },
    {
        text: "Products",
        items: [
            { text: 'Categories', link: '/merchant/product/categories' },
            { text: 'Products', link: '/merchant/product/products' },
            { text: 'Product Types', link: '/merchant/product/product-types' },
            { text: 'Variants', link: '/merchant/product/variants' },
            { text: 'Bundles', link: '/merchant/product/bundles' },
            { text: 'Inventory', link: '/merchant/product/inventory' },
            { text: 'Manufacturers', link: '/merchant/product/manufacturers' },
            { text: 'Custom Groups', link: '/merchant/product/custom-groups' },
            { text: 'Reviews', link: '/merchant/product/reviews' },
            { text: 'Discounts', link: '/merchant/product/discounts' }
        ]
    },
    {
        text: "Customers",
        items: [
            { text: 'Customers', link: '/merchant/customer/customers' },
            { text: 'Locations', link: '/merchant/customer/locations' },
            { text: 'Taxes', link: '/merchant/customer/taxes' }
        ]
    },
    {
        text: "Orders",
        items: [
            { text: 'Orders', link: '/merchant/order/orders' },
            { text: 'Payments', link: '/merchant/order/payments' },
            { text: 'Shipping', link: '/merchant/order/shipping' },
            { text: 'Shipping Labels', link: '/merchant/order/shipping-labels' },
            { text: 'Packing Slips', link: '/merchant/order/packing-slips' },
            { text: 'Tracking', link: '/merchant/order/tracking' },
            { text: 'Digital Downloads', link: '/merchant/order/downloads' },
            { text: 'Refunds', link: '/merchant/order/refunds' }
        ]
    },
    {
        text: "Settings",
        items: [
            { text: 'Store Configuration', link: '/merchant/settings/store' },
            { text: 'Multi-Store Setup', link: '/merchant/settings/multi-store' }
        ]
    }
];

const developerSidebar = [
    {
        text: "Getting Started",
        items: [
            { text: 'Introduction', link: '/developer/introduction' }
        ]
    },
    {
        text: "Catalog",
        items: [
            { text: 'Catalog', link: '/developer/components/catalog' },
            { text: 'Catalog Filtering', link: '/developer/components/catalog-filtering' },
            { text: 'Reviews', link: '/developer/components/reviews' },
            { text: 'Wishlist', link: '/developer/components/wishlist' }
        ]
    },
    {
        text: "Checkout",
        items: [
            { text: 'Cart', link: '/developer/components/cart' },
            { text: 'Checkout', link: '/developer/components/checkout' }
        ]
    },
    {
        text: "Customer",
        items: [
            { text: 'Session', link: '/developer/components/session' },
            { text: 'Registration', link: '/developer/components/registration' },
            { text: 'Authentication', link: '/developer/components/authentication' },
            { text: 'New Password', link: '/developer/components/new-password' },
            { text: 'Profile Details', link: '/developer/components/profile-details' },
            { text: 'Security Details', link: '/developer/components/security-details' },
            { text: 'Order History', link: '/developer/components/order-history' }
        ]
    },
    {
        text: "Models",
        items: [
            { text: 'Product', link: '/developer/models/product' },
            { text: 'Pricing', link: '/developer/models/pricing' },
            { text: 'Order', link: '/developer/models/order' },
            { text: 'Invoice', link: '/developer/models/invoice' },
            { text: 'Inventory', link: '/developer/models/inventory' },
            { text: 'Catalog', link: '/developer/models/category' }
        ]
    },
    {
        text: "Hooks & Events",
        items: [
            { text: 'Events', link: '/developer/hooks/events' }
        ]
    },
    {
        text: "Extending",
        items: [
            { text: 'Payment Gateways', link: '/developer/extending/payment-gateways' },
            { text: 'Shipping Types', link: '/developer/extending/shipping-types' },
            { text: 'Price Rules', link: '/developer/extending/price-rules' }
        ]
    },
    {
        text: "Theming",
        items: [
            { text: 'Customization', link: '/developer/theming/customization' }
        ]
    }
];

export default {
    title: 'Meloncart',
    description: 'A a modern eCommerce toolkit built on Laravel',
    head: [
        ['link', { rel: 'icon', href: '/favicon.svg' }]
    ],
    themeConfig: {
        siteTitle: false,
        logo: {
            light: '/logo.svg',
            dark: '/logo-dark.svg'
        },
        nav: [
            { text: 'Get Started', link: '/get-started/installation' },
            { text: 'Features', link: '/features/' },
            { text: 'Merchant', link: '/merchant/introduction' },
            { text: 'Developer', link: '/developer/introduction' },
            { text: 'GitHub', link: 'https://github.com/meloncart' }
        ],
        sidebar: {
            '/get-started/': getStartedSidebar,
            '/features/': featuresSidebar,
            '/merchant/': merchantSidebar,
            '/developer/': developerSidebar
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/meloncart' }
        ],
        search: { provider: 'local' },
        outline: [2, 3] // h2 and h3
    }
}

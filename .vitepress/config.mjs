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
            { text: 'Variants', link: '/merchant/product/variants' },
            { text: 'Inventory', link: '/merchant/product/inventory' },
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
            { text: 'Refunds', link: '/merchant/order/refunds' }
        ]
    },
    {
        text: "Settings",
        items: [
            { text: 'Store Configuration', link: '/merchant/settings/store' }
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
        text: "Components",
        items: [
            { text: 'Cart', link: '/developer/components/cart' },
            { text: 'Catalog', link: '/developer/components/catalog' },
            { text: 'Checkout', link: '/developer/components/checkout' },
            { text: 'Session', link: '/developer/components/session' },
            { text: 'Registration', link: '/developer/components/registration' },
            { text: 'Authentication', link: '/developer/components/authentication' },
            { text: 'New Password', link: '/developer/components/new-password' },
            { text: 'Profile Details', link: '/developer/components/profile-details' },
            { text: 'Security Details', link: '/developer/components/security-details' },
            { text: 'Wishlist', link: '/developer/components/wishlist' },
            { text: 'Order History', link: '/developer/components/order-history' }
        ]
    },
    {
        text: "Hooks & Events",
        items: [
            { text: 'Events', link: '/developer/hooks/events' }
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
            { text: 'Merchant', link: '/merchant/introduction' },
            { text: 'Developer', link: '/developer/introduction' },
            { text: 'GitHub', link: 'https://github.com/meloncart' }
        ],
        sidebar: {
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

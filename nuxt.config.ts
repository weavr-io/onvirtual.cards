import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
    ssr: false,
    devServer: {
        host: '0.0.0.0',
        port: 5000,
    },
    vite: {
        plugins: [
            svgLoader({
                defaultImport: 'url',
            }),
        ],
    },
    runtimeConfig: {
        public: {
            production: process.env.ENVIRONMENT === 'production',
            multiApi: {
                baseUrl: process.env.MULTI_BASE_URL,
                uiKey: process.env.UI_KEY,
            },
            profileId: {
                consumers: process.env.CONSUMERS_PROFILE_ID,
                corporates: process.env.CORPORATES_PROFILE_ID,
                managed_cards_consumers: process.env.MANAGED_CARDS_CONSUMERS_PROFILE_ID,
                managed_cards_consumers_uk: process.env.MANAGED_CARDS_CONSUMERS_PROFILE_ID_UK,
                managed_cards_corporates: process.env.MANAGED_CARDS_CORPORATES_PROFILE_ID,
                managed_cards_corporates_uk: process.env.MANAGED_CARDS_CORPORATES_PROFILE_ID_UK,
                managed_accounts_consumers: process.env.MANAGED_ACCOUNTS_CONSUMERS_PROFILE_ID,
                managed_accounts_consumers_uk: process.env.MANAGED_ACCOUNTS_CONSUMERS_PROFILE_ID_UK,
                managed_accounts_corporates: process.env.MANAGED_ACCOUNTS_CORPORATES_PROFILE_ID,
                managed_accounts_corporates_uk:
                    process.env.MANAGED_ACCOUNTS_CORPORATES_PROFILE_ID_UK,
                transfers: process.env.TRANSFERS_PROFILE_ID,
                send: process.env.SEND_PROFILE_ID,
            },
            recaptcha: {
                siteKey: process.env.RECAPTCHA,
            },
        },
        app: {
            view_register: process.env.VIEW_REGISTER ? JSON.parse(process.env.VIEW_REGISTER) : true,
            sumsub_enabled: process.env.SUM_SUB ? JSON.parse(process.env.SUM_SUB) : true,
        },
    },
    app: {
        head: {
            title: 'onvirtual.cards',
            meta: [
                { charset: 'utf-8' },
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1',
                },
                {
                    hid: 'description',
                    name: 'description',
                    content: process.env.npm_package_description ?? '',
                },
            ],
            script: [
                {
                    src: process.env.BASE_URL_SCRIPT,
                    type: 'application/javascript',
                },
            ],
            link: [
                {
                    rel: 'apple-touch-icon',
                    href: '/apple-touch-icon.png',
                },
                {
                    rel: 'icon',
                    type: 'image/png',
                    sizes: '32x32',
                    href: '/favicon-32x32.png',
                },
                {
                    rel: 'icon',
                    type: 'image/png',
                    sizes: '16x16',
                    href: '/favicon-16x16.png',
                },
                {
                    rel: 'manifest',
                    href: '/site.webmanifest',
                },
                {
                    rel: 'mask-ico',
                    href: '/safari-pinned-tab.svg',
                    color: '#5bbad5',
                },
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css?family=Be+Vietnam:100,100i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i&display=swap',
                },
            ],
        },
        pageTransition: {
            name: 'fade',
            mode: 'out-in',
        },
        layoutTransition: {
            name: 'fade',
            mode: 'out-in',
        },
    },
    spaLoadingTemplate: true,
    css: ['~/assets/scss/style.scss'],
    plugins: [
        { src: '~/plugins/weavr/security.client.ts' },
        { src: '~/plugins/WeavrVueFilters.ts' },
        { src: '~/plugins/flatpickr.ts' },
        { src: '~/plugins/InfiniteLoading.ts' },
        { src: '~/plugins/axios.ts' },
        { src: '~/plugins/axios-accessor.ts' },
        { src: '~/plugins/weavr-multi/index.ts' },
        { src: '~/plugins/formattingFilters/index.ts' },
        { src: '~/plugins/auth-body-class.ts' },
        { src: '~/plugins/virtual-scroller.ts' },
        { src: '~/plugins/recaptcha/main.ts' },
    ],
    build: {
        transpile: ['bootstrap-vue-next', 'vue3-virtual-scroller'],
    },
    modules: ['@pinia/nuxt', '@bootstrap-vue-next/nuxt'],
    router: {
        options: {
            linkActiveClass: 'active',
        },
    },
    typescript: {
        strict: true,
        typeCheck: true,
    },
})

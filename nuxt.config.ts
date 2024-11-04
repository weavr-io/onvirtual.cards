import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
    ssr: false,

    vite: {
        plugins: [
            svgLoader({
                defaultImport: 'component',
                svgoConfig: {
                    multipass: true,
                },
            }),
        ],
    },

    runtimeConfig: {
        public: {
            production: import.meta.env.ENVIRONMENT === 'production',
            multiApi: {
                baseUrl: import.meta.env.MULTI_BASE_URL,
                uiKey: import.meta.env.UI_KEY,
            },
            profileId: {
                consumers: import.meta.env.CONSUMERS_PROFILE_ID,
                corporates: import.meta.env.CORPORATES_PROFILE_ID,
                managed_cards_consumers: import.meta.env.MANAGED_CARDS_CONSUMERS_PROFILE_ID,
                managed_cards_consumers_uk: import.meta.env.MANAGED_CARDS_CONSUMERS_PROFILE_ID_UK,
                managed_cards_corporates: import.meta.env.MANAGED_CARDS_CORPORATES_PROFILE_ID,
                managed_cards_corporates_uk: import.meta.env.MANAGED_CARDS_CORPORATES_PROFILE_ID_UK,
                managed_accounts_consumers: import.meta.env.MANAGED_ACCOUNTS_CONSUMERS_PROFILE_ID,
                managed_accounts_consumers_uk: import.meta.env
                    .MANAGED_ACCOUNTS_CONSUMERS_PROFILE_ID_UK,
                managed_accounts_corporates: import.meta.env.MANAGED_ACCOUNTS_CORPORATES_PROFILE_ID,
                managed_accounts_corporates_uk: import.meta.env
                    .MANAGED_ACCOUNTS_CORPORATES_PROFILE_ID_UK,
                transfers: import.meta.env.TRANSFERS_PROFILE_ID,
                send: import.meta.env.SEND_PROFILE_ID,
            },
            recaptcha: {
                siteKey: import.meta.env.RECAPTCHA,
            },
        },
        app: {
            view_register: import.meta.env.VIEW_REGISTER
                ? JSON.parse(import.meta.env.VIEW_REGISTER)
                : true,
            sumsub_enabled: import.meta.env.SUM_SUB ? JSON.parse(import.meta.env.SUM_SUB) : true,
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
                    content: import.meta.env.npm_package_description ?? '',
                },
            ],
            script: [
                {
                    src: import.meta.env.BASE_URL_SCRIPT,
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
    },

    spaLoadingTemplate: true,
    css: ['~/assets/scss/style.scss', 'bootstrap-icons/font/bootstrap-icons.css'],

    plugins: [
        { src: '~/plugins/weavr/security.client.ts' },
        { src: '~/plugins/WeavrToast.ts' },
        { src: '~/plugins/flatpickr.ts' },
        { src: '~/plugins/InfiniteLoading.ts' },
        { src: '~/plugins/axios.ts' },
        { src: '~/plugins/axios-accessor.ts' },
        { src: '~/plugins/weavr-multi/index.ts' },
        { src: '~/plugins/formattingFilters/index.ts' },
        { src: '~/plugins/virtual-scroller.ts' },
        { src: '~/plugins/recaptcha.client.ts' },
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

    compatibilityDate: '2024-09-05',
})

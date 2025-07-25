const config = {
    ssr: false,
    target: 'static',
    server: {
        host: '0.0.0.0',
        port: 5000,
    },
    publicRuntimeConfig: {
        multiApi: {
            baseUrl: process.env.MULTI_BASE_URL,
            uiKey: process.env.UI_KEY,
        },
        production: process.env.ENVIRONMENT === 'production',
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
            managed_accounts_corporates_uk: process.env.MANAGED_ACCOUNTS_CORPORATES_PROFILE_ID_UK,
            transfers: process.env.TRANSFERS_PROFILE_ID,
            send: process.env.SEND_PROFILE_ID,
        },
        pmlIdentityId: process.env.PML_IDENTITY_ID,
        pmlManagedAccountId: process.env.PML_MANAGED_ACCOUNT_ID,
        app: {
            view_register: process.env.VIEW_REGISTER ? JSON.parse(process.env.VIEW_REGISTER) : true,
            sumsub_enabled: process.env.SUM_SUB ? JSON.parse(process.env.SUM_SUB) : true,
        },
    },
    /*
     ** Headers of the page
     */
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
                content: process.env.npm_package_description || '',
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
    transition: {
        name: 'fade',
        mode: 'out-in',
    },
    /*
     ** Customize the progress-bar color
     */
    loading: false,
    /*
     ** Global CSS
     */
    css: ['~/assets/scss/style.scss'],
    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        {
            src: '~/plugins/weavr/security.client.ts',
            ssr: false,
        },
        {
            src: '~/plugins/WeavrVueFilters.ts',
            ssr: false,
        },
        {
            src: '~/plugins/flatpickr.ts',
            ssr: false,
        },
        {
            src: '~/plugins/InfiniteLoading.ts',
            ssr: false,
        },
        { src: '~/plugins/axios.ts' },
        { src: '~/plugins/axios-accessor.ts' },
        { src: '~/plugins/weavr-multi/index.ts' },
        { src: '~/plugins/formattingFilters/index.ts' },
    ],
    /*
     ** Nuxt.ts modules
     */
    modules: [
        // Doc: https://bootstrap-vue.js.org/docs/
        'bootstrap-vue/nuxt',
        '@nuxtjs/dotenv', // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios', // '@nuxtjs/eslint-module'
        '@nuxtjs/svg',
    ],
    bootstrapVue: {
        bootstrapCSS: false, // Or `css: false`
        bootstrapVueCSS: false, // Or `bvCSS: false`
    },
    recaptcha: {
        siteKey: process.env.RECAPTCHA,
        version: 2,
    },
    /*
     ** Axios module configuration
     ** See https://axios.nuxtjs.org/options
     */
    axios: {},
    router: {
        middleware: ['authCookie', 'errorReset', 'identities'],
        linkActiveClass: 'active',
    },
    buildModules: ['@nuxtjs/composition-api/module', '@pinia/nuxt', '@nuxt/typescript-build'],
    build: {
        babel: {
            compact: true,
        },
    },
    typescript: {
        typeCheck: true,
        ignoreNotFoundWarnings: true,
    },
}

if (process.env.RECAPTCHA) {
    config.modules.push('@nuxtjs/recaptcha')
}

export default config

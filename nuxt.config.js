import * as dotenv from 'dotenv'

const env = dotenv.config({ debug: true })

const config = {
  mode: 'spa',
  env: env.parsed,
  server: {
    port: 5000
  },
  /*
   ** Headers of the page
   */
  head: {
    title: 'onvirtual.cards',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    script: [
      {
        src: process.env.BASE_URL_SCRIPT + '/app/secure/static/client.1.js',
        // src: 'https://6393d6e6.ngrok.io/client.1.js',
        type: 'application/javascript'
      },
      {
        src: 'https://test-api.sumsub.com/idensic/static/sumsub-kyc.js',
        type: 'application/javascript'
      }
    ],

    link: [
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-ico', href: '/safari-pinned-tab.svg', color: '#5bbad5' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Be+Vietnam:100,100i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i&display=swap'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#6C1C5C' },
  /*
   ** Global CSS
   */
  css: ['~/assets/scss/style.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/vuelidate' },
    { src: '~/plugins/weavr/security.client.ts' },
    { src: '~/plugins/WeavrVueFilters.ts', ssr: false },
    { src: '~/plugins/PhoneNumberInput.ts', ssr: false },
    { src: '~/plugins/flatpickr.ts', ssr: false }
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // '@nuxtjs/eslint-module'
    '@dansmaculotte/nuxt-segment',
    '@nuxtjs/svg'
  ],
  bootstrapVue: {
    bootstrapCSS: false, // Or `css: false`
    bootstrapVueCSS: false // Or `bvCSS: false`
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  router: {
    middleware: ['authCookie', 'errorReset'],
    linkActiveClass: 'active'
  },
  buildModules: ['@nuxt/typescript-build'],
  typescript: {
    typeCheck: true,
    ignoreNotFoundWarnings: true
  }
}

export default config

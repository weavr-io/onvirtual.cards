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
        type: 'application/javascript'
      },
      {
        src: '//fast.appcues.com/66365.js',
        type: 'application/javascript'
      },
      {
        src: 'https://deploy.userpilot.io/49wr57v8.js',
        type: 'application/javascript'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
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
  loading: { color: '#742B66' },
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
    { src: '~/plugins/appcues.ts', ssr: false },
    { src: '~/plugins/userpilot.ts', ssr: false }
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
    // '@nuxtjs/eslint-module'
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
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },
  router: {
    middleware: ['authCookie', 'appcues', 'userpilot']
  },
  buildModules: ['@nuxt/typescript-build'],
  typescript: {
    typeCheck: true,
    ignoreNotFoundWarnings: true
  }
}

export default config

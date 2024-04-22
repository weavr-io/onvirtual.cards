import 'vue'
import '@nuxt/types'

declare module 'vue/types/vue' {
    interface Vue {
        $weavrComponents: any
        $weavrSetUserToken: (token: unknown) => {}
    }
}

declare module '@nuxt/types' {
    // nuxtContext.app.$weavrSetUserToken inside asyncData, fetch, plugins, middleware, nuxtServerInit
    interface NuxtAppOptions {
        $weavrSetUserToken: (token: unknown) => {}
    }

    // nuxtContext.$weavrSetUserToken
    interface Context {
        $weavrSetUserToken: (token: unknown) => {}
    }
}

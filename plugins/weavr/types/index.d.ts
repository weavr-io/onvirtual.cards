import 'vue'
import '@nuxt/types'

declare module 'vue/types/vue' {
    interface Vue {
        $weavrComponents: any
        $weavrSetUserToken: (token: any) => {}
    }
}

declare module '@nuxt/types' {
    // nuxtContext.app.$weavrSetUserToken inside asyncData, fetch, plugins, middleware, nuxtServerInit
    interface NuxtAppOptions {
        $weavrSetUserToken: (token: any) => {}
    }

    // nuxtContext.$weavrSetUserToken
    interface Context {
        $weavrSetUserToken: (token: any) => {}
    }
}

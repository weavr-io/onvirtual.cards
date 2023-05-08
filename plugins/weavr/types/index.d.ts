import 'vue'
import '@nuxt/types'

declare module 'vue/types/vue' {
    interface Vue {
        $weavrComponents: any
        $weavrSetUserToken: (token) => {}
    }
}

declare module '@nuxt/types' {
    // nuxtContext.app.$weavrSetUserToken inside asyncData, fetch, plugins, middleware, nuxtServerInit
    interface NuxtAppOptions {
        $weavrSetUserToken: (token) => {}
    }

    // nuxtContext.$weavrSetUserToken
    interface Context {
        $weavrSetUserToken: (token) => {}
    }
}

declare module 'vuex/types/index' {
    // this.$weavrSetUserToken inside Vuex stores
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Store<S> {
        $weavrSetUserToken: (token) => {}
    }
}

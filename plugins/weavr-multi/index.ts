import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { ApiInterface } from '~/plugins/weavr-multi/api/ApiInterface'
import { ApiModule } from '~/plugins/weavr-multi/api/ApiModule'

declare module 'vue/types/vue' {
    interface Vue {
        $apiMulti: ApiInterface
    }
}

declare module '@nuxt/types' {
    interface NuxtAppOptions {
        $apiMulti: ApiInterface
    }

    interface Context {
        $apiMulti: ApiInterface
    }
}

export default defineNuxtPlugin((_, inject) => {
    inject('apiMulti', new ApiModule())
})

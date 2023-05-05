import { Plugin } from '@nuxt/types'
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

declare module 'vuex/types/index' {
    interface Store<S> {
        $apiMulti: ApiInterface
    }
}

const weavrMultiPlugin: Plugin = (_context, _inject) => {
    _inject('apiMulti', new ApiModule())
}

export default weavrMultiPlugin

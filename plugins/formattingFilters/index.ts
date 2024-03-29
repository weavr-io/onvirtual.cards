import { Plugin } from '@nuxt/types'
import { FormattingFiltersModule } from '~/plugins/formattingFilters/FormattingFiltersModule'
import { FormattingFiltersInterface } from '~/plugins/formattingFilters/FormattingFiltersInterface'

declare module 'vue/types/vue' {
    // this.$formattingFilters inside Vue components
    interface Vue {
        $formattingFilters: FormattingFiltersInterface
    }
}

declare module '@nuxt/types' {
    // nuxtContext.app.$formattingFilters inside asyncData, fetch, plugins, middleware, nuxtServerInit
    interface NuxtAppOptions {
        $formattingFilters: FormattingFiltersInterface
    }

    // nuxtContext.$formattingFilters
    interface Context {
        $formattingFilters: FormattingFiltersInterface
    }
}

declare module 'vuex/types/index' {
    // this.$formattingFilters inside Vuex stores
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Store<S> {
        $formattingFilters: FormattingFiltersInterface
    }
}

const formattingFiltersPlugin: Plugin = (_context, _inject) => {
    _inject('formattingFilters', new FormattingFiltersModule())
}

export default formattingFiltersPlugin

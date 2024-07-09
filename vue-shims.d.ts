import type { ApiInterface } from '~/plugins/weavr-multi/api/ApiInterface'
import type { BvToastOptions } from '~/node_modules/bootstrap-vue'
import type { FormattingFiltersInterface } from '~/plugins/formattingFilters/FormattingFiltersInterface'
import { BvModal, BvToast } from 'bootstrap-vue'

// global, also used in store
declare module 'nuxt/app' {
    interface NuxtApp {
        $formattingFilters: FormattingFiltersInterface
        $apiMulti: ApiInterface
        $weavrComponents: any
        $weavrSetUserToken: (token: unknown) => {}
        $bvModal: BvModal
        $bvToast: BvToast
        readonly $weavrToast: WeavrToast
        readonly $weavrToastError: WeavrToast
    }
}

export interface WeavrToast {
    (message: string, options?: BvToastOptions): void
}

declare module '*.svg?inline' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent
    export default component
}

declare global {
    interface ImportMetaGlob {
        (
            pattern: string,
            options?: {
                eager?: boolean
            },
        ): Record<string, () => Promise<unknown>>
    }

    interface ImportMeta {
        glob: ImportMetaGlob
    }
}

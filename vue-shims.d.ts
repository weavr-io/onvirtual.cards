import type { ApiInterface } from '~/plugins/weavr-multi/api/ApiInterface'
import type { FormattingFiltersInterface } from '~/plugins/formattingFilters/FormattingFiltersInterface'
import type { NuxtAxiosInstance } from '@nuxtjs/axios'
import { useRecaptcha } from 'vue3-recaptcha-v2'

declare module 'vue' {
    interface ComponentCustomProperties {
        $apiMulti: ApiInterface
        $recaptcha: ReturnType<typeof useRecaptcha>
    }
}

// global, also used in store
declare module 'nuxt/app' {
    interface NuxtApp {
        $formattingFilters: FormattingFiltersInterface
        $apiMulti: ApiInterface
        $axiosMulti: NuxtAxiosInstance
        $weavrComponents: any
        $weavrSetUserToken: (token: unknown) => {}
        $bvToast: any // TODO: refactor, make component specific
        readonly $weavrToast: WeavrToast
        readonly $weavrToastError: WeavrToast
        $recaptcha: ReturnType<typeof useRecaptcha>
    }
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $weavrSetUserToken: (token: string) => {}
        $recaptcha: ReturnType<typeof useRecaptcha>
    }
}

export interface WeavrToast {
    (message: string, options?: any): void // TODO: try BModalOrchestrator
}

declare global {
    interface ImportMetaGlob {
        (
            glob: string,
            options?: {
                as?: string
                eager?: boolean
            },
        ): Record<string, () => Promise<unknown>>
    }

    interface ImportMeta {
        glob: ImportMetaGlob
    }
}

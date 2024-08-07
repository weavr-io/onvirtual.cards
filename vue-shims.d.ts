import type { ApiInterface } from '~/plugins/weavr-multi/api/ApiInterface'
import type { FormattingFiltersInterface } from '~/plugins/formattingFilters/FormattingFiltersInterface'
import type { NuxtAxiosInstance } from '@nuxtjs/axios'

// global, also used in store
declare module 'nuxt/app' {
    interface NuxtApp {
        $formattingFilters: FormattingFiltersInterface
        $apiMulti: ApiInterface
        $axiosMulti: NuxtAxiosInstance
        $weavrComponents: any
        $weavrSetUserToken: (token: unknown) => {}
        $bvModal: any // TODO: refactor, make component specific
        $bvToast: any // TODO: refactor, make component specific
        readonly $weavrToast: WeavrToast
        readonly $weavrToastError: WeavrToast
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

import { ReCaptchaInstance } from 'recaptcha-v3'

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $recaptcha: (action: string) => Promise<string>
        $recaptchaLoaded: () => Promise<boolean>
        $recaptchaInstance: ReCaptchaInstance
    }
}

import type { ApiInterface } from '~/plugins/weavr-multi/api/ApiInterface'
import type { BvToastOptions } from '~/node_modules/bootstrap-vue'
import { BvModal, BvToast } from 'bootstrap-vue'

// global, also used in store
declare module 'nuxt/app' {
    interface NuxtApp {
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

declare namespace __WebpackModuleApi {
    interface RequireContext {
        keys(): string[]
        (id: string): any
        <T>(id: string): T
        resolve(id: string): string
        /** The module id of the context module. This may be useful for module.hot.accept. */
        id: string
    }
}

interface Require {
    context(
        path: string,
        deep?: boolean,
        filter?: RegExp,
        mode?: 'sync' | 'eager' | 'weak' | 'lazy' | 'lazy-once',
    ): __WebpackModuleApi.RequireContext
}

import type { ApiInterface } from '~/plugins/weavr-multi/api/ApiInterface'

// global, also used in store
declare module 'nuxt/app' {
    interface NuxtApp {
        $apiMulti: ApiInterface
        $weavrComponents: any
        $weavrSetUserToken: (token: unknown) => {}
    }
}

declare module '*.svg?inline' {
    import { DefineComponent } from 'vue'
    const content: DefineComponent
    export default content
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

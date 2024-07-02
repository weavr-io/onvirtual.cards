declare module '*.vue' {
    import Vue from 'vue'
    export default Vue
}

declare module '*.svg?inline' {
    import Vue, { VueConstructor } from 'vue'
    const content: VueConstructor<Vue>
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

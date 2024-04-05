import type { StoreDefinition } from 'pinia'
import { useBase } from '~/composables/useBase'

const { root } = useBase()
const modules: Record<string, StoreDefinition> = {}

// import meta since we have vite enabled
const moduleFiles = import.meta.glob('@/store/*.ts')

await Promise.all(
    Object.entries(moduleFiles).map(async ([path, moduleFile]) => {
        // TODO: Remove line after deleting index file
        if (path === './index.ts') return

        const moduleName = root!.$formattingFilters.text.convertToCamelCase(
            path.replace(/(\.\/|\.ts)/g, ''),
        )

        const module = await moduleFile()
        modules[moduleName] = module as StoreDefinition
    }),
)

export function initialiseStores(storeNames: string[], resetOption?: boolean) {
    const stores = {}

    storeNames.forEach((store) => {
        const storeModule = modules[`/stores/${store}`]

        if (!storeModule) {
            throw new Error(`Pinia store module '${store}' not found.`)
        }

        const storeInstance =
            storeModule[`use${root!.$formattingFilters.text.capitalizeFirstLetter(store)}Store`]

        stores[store] = storeInstance

        // reset stores
        if (resetOption && typeof storeInstance.resetState === 'function') {
            storeInstance.resetState()
        }
    })

    return stores
}

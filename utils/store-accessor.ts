import type { StoreDefinition } from 'pinia'
import type { StoreType } from '~/local/models/store'
import { FormattingFiltersModule } from '~/plugins/formattingFilters/FormattingFiltersModule'

const modules: Record<string, StoreDefinition> = {}
const { text } = new FormattingFiltersModule()

// import meta since we have vite enabled
const moduleFiles = import.meta.glob('@/store/*.ts')

await Promise.all(
    Object.entries(moduleFiles).map(async ([path, moduleFile]) => {
        // TODO: Remove line after deleting index file
        if (path === './index.ts') return

        const moduleName = text.convertToCamelCase(path.replace(/(\.\/|\.ts)/g, ''))

        const module = await moduleFile()
        modules[moduleName] = module as StoreDefinition
    }),
)

export function initialiseStores<T extends keyof StoreType>(
    storeNames: T[],
    resetOption?: boolean,
) {
    const stores: Partial<{ [K in T]: StoreType[K] }> = {}

    storeNames.forEach((store) => {
        const storeModule = modules[`/stores/${store}`]

        if (!storeModule) {
            throw new Error(`Pinia store module '${store}' not found.`)
        }

        const storeInstance = storeModule[`use${text.capitalizeFirstLetter(store)}Store`]

        stores[store] = storeInstance

        // reset stores
        if (resetOption && typeof storeInstance.resetState === 'function') {
            storeInstance.resetState()
        }
    })

    return stores
}

import type { StoreDefinition } from 'pinia'
import type { StoreType, StoreModule } from '~/local/models/store'
import { FormattingFiltersModule } from '~/plugins/formattingFilters/FormattingFiltersModule'

interface CustomStore extends StoreDefinition {
    resetState?: () => void
}

const modules: Record<string, CustomStore> = {}
const { text } = new FormattingFiltersModule()
const moduleFiles = import.meta.glob<StoreModule>('@/store/*.ts', { eager: true })

export function initialiseStores<T extends keyof StoreType>(
    storeNames: T[],
    resetOption?: boolean,
): Partial<{ [K in T]: StoreType[K] }> {
    const stores: Partial<{ [K in T]: StoreType[K] }> = {}

    Object.entries(moduleFiles).forEach(([path, module]) => {
        const moduleName = path.replace(/(\.\/|\.ts)/g, '')
        const exportName = `use${text.capitalizeFirstLetter(moduleName)}Store`

        if (typeof module[exportName] === 'function') {
            modules[moduleName] = module[exportName]()
        } else {
            throw new TypeError('Store module does not export a function by default.')
        }
    })

    storeNames.forEach((store) => {
        const storeModule = modules[store]

        if (!storeModule) {
            throw new Error(`Pinia store module '${store}' not found.`)
        }

        stores[store] = storeModule as unknown as StoreType[T]

        // reset stores
        if (resetOption && typeof storeModule.resetState === 'function') {
            storeModule.resetState()
        }
    })

    return stores
}

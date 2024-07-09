import type { StoreType } from '~/local/models/store'
import { FormattingFiltersModule } from '~/plugins/formattingFilters/FormattingFiltersModule'

const modules: Record<string, any> = {}
const { text } = new FormattingFiltersModule()
const moduleFiles = import.meta.glob('@/store/**/*.ts', { eager: true }) as Record<string, unknown>

export function initialiseStores<T extends keyof StoreType>(
    storeNames: T[],
    resetOption?: boolean,
): Partial<{ [K in T]: StoreType[K] }> {
    const stores: Partial<{ [K in T]: StoreType[K] }> = {}

    moduleFiles.keys().forEach((path: string) => {
        // incase filename is not camel case already
        const moduleName = path.replace(/(\.\/|\.ts)/g, '')
        const module = moduleFiles(path)

        const exportName = `use${text.capitalizeFirstLetter(moduleName)}Store`

        if (module[exportName] && typeof module[exportName] === 'function') {
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

        stores[store] = storeModule

        // reset stores
        if (resetOption && typeof storeModule.resetState === 'function') {
            storeModule.resetState()
        }
    })

    return stores
}

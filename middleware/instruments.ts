import type { Middleware } from '~/node_modules/@nuxt/types'
import { accountsStore, authStore } from '~/utils/store-accessor'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import { useBase } from '@/composables/useBase'

const { useRuntimeConfig } = useBase()

const instrumentsMiddleware: Middleware = async ({ store, route }) => {
    // this will run in async before every route change in order to populate identities respectively

    if (accountsStore(store).accounts === null && route.name?.includes('managed-accounts')) {
        await accountsStore(store).index({
            profileId: authStore(store).isConsumer
                ? useRuntimeConfig().public.profileId.managed_accounts_consumers!
                : useRuntimeConfig().public.profileId.managed_accounts_corporates!,
            state: ManagedInstrumentStateEnum.ACTIVE,
            offset: '0',
        })
    }
}

export default instrumentsMiddleware

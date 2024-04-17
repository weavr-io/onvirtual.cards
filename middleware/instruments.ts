import type { Middleware } from '~/node_modules/@nuxt/types'
import { useBase } from '~/composables/useBase'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'

const { authStore, accountsStore } = useBase()
const instrumentsMiddleware: Middleware = async ({ route, $config }) => {
    // this will run in async before every route change in order to populate identities respectively

    if (!accountsStore.accountState.accounts && route.name?.includes('managed-accounts')) {
        await accountsStore.index({
            profileId: authStore.isConsumer
                ? $config.profileId.managed_accounts_consumers!
                : $config.profileId.managed_accounts_corporates!,
            state: ManagedInstrumentStateEnum.ACTIVE,
            offset: '0',
        })
    }
}

export default instrumentsMiddleware

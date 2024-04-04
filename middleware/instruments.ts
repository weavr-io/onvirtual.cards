import { Middleware } from '~/node_modules/@nuxt/types'
import { accountsStore, authStore } from '~/utils/store-accessor'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'

const instrumentsMiddleware: Middleware = async ({ store, route, $config }) => {
    // this will run in async before every route change in order to populate identities respectively

    if (accountsStore(store).accounts === null && route.name?.includes('managed-accounts')) {
        await accountsStore(store).index({
            profileId: authStore(store).isConsumer
                ? $config.profileId.managed_accounts_consumers!
                : $config.profileId.managed_accounts_corporates!,
            state: ManagedInstrumentStateEnum.ACTIVE,
            offset: '0',
        })
    }
}

export default instrumentsMiddleware

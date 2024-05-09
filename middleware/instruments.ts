import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import { initialiseStores } from '~/utils/pinia-store-accessor'

export default defineNuxtMiddleware(async ({ route, $config }) => {
    // this will run in async before every route change in order to populate identities respectively
    const { auth, accounts } = initialiseStores(['auth', 'accounts'])

    if (!accounts?.accountState.accounts && route.name?.includes('managed-accounts')) {
        await accounts
            ?.index({
                profileId: auth?.isConsumer
                    ? $config.profileId.managed_accounts_consumers!
                    : $config.profileId.managed_accounts_corporates!,
                state: ManagedInstrumentStateEnum.ACTIVE,
                offset: '0',
            })
            .catch(() => {})
    }
})

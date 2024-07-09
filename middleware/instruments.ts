import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import { initialiseStores } from '~/utils/pinia-store-accessor'

export default defineNuxtRouteMiddleware(async (to) => {
    // this will run in async before every route change in order to populate identities respectively
    const { auth, accounts } = initialiseStores(['auth', 'accounts'])
    const { profileId } = useRuntimeConfig().public

    if (
        !accounts?.accountState.accounts &&
        typeof to.name === 'string' &&
        to.name.includes('managed-accounts')
    ) {
        await accounts?.index({
            profileId: auth?.isConsumer
                ? profileId.managed_accounts_consumers!
                : profileId.managed_accounts_corporates!,
            state: ManagedInstrumentStateEnum.ACTIVE,
            offset: '0',
        })
    }
})

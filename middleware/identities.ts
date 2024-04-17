import type { Middleware } from '@nuxt/types'
import { initialiseStores } from '~/utils/pinia-store-accessor'

const identitiesMiddleware: Middleware = async () => {
    // this will run in async before every route change in order to populate identities respectively
    const { auth, consumers, corporates } = initialiseStores(['auth', 'consumers', 'corporates'])

    if (auth?.isConsumer && !consumers?.consumerState.consumer) {
        await consumers?.get().catch(() => {})
    }

    if (auth?.isCorporate && !corporates?.corporateState.corporate) {
        await corporates?.get().catch(() => {})
    }
}

export default identitiesMiddleware

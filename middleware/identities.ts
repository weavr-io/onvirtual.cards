import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
import { initialiseStores } from '~/utils/pinia-store-accessor'

export default defineNuxtMiddleware((_) => {
    // this will run in async before every route change in order to populate identities respectively
    const { auth, consumers, corporates } = initialiseStores(['auth', 'consumers', 'corporates'])

    if (auth?.isConsumer && !consumers?.consumerState.consumer) {
        consumers?.get().catch(() => {})
    }

    if (auth?.isCorporate && !corporates?.corporateState.corporate) {
        corporates?.get().catch(() => {})
    }
})

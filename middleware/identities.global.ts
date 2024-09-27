import { useStores } from '~/composables/useStores'

export default defineNuxtRouteMiddleware(async () => {
    // this will run in async before every route change in order to populate identities respectively
    const { auth, consumers, corporates } = useStores(['auth', 'consumers', 'corporates'])

    if (auth?.isConsumer && !consumers?.consumerState.consumer) {
        await consumers?.get()
    }

    if (auth?.isCorporate && !corporates?.corporateState.corporate) {
        await corporates?.get()
    }
})

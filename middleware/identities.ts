import type { Middleware } from '@nuxt/types'
import { useBase } from '~/composables/useBase'

const { authStore, consumersStore, corporatesStore } = useBase()
const identitiesMiddleware: Middleware = async () => {
    // this will run in async before every route change in order to populate identities respectively

    if (authStore.isConsumer && !consumersStore.consumerState.consumer) {
        await consumersStore.get().catch(() => {})
    }

    if (authStore.isCorporate && !corporatesStore.corporateState.corporate) {
        await corporatesStore.get().catch(() => {})
    }
}

export default identitiesMiddleware

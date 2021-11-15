import { Middleware } from '@nuxt/types'
import { authStore, consumersStore, corporatesStore } from '~/utils/store-accessor'

const identitiesMiddleware: Middleware = async ({ store }) => {
  // this will run in async before every route change in order to populate identities respectively

  if (authStore(store).isConsumer && consumersStore(store).consumer === null) {
    await consumersStore(store).get()
  }

  if (authStore(store).isCorporate && corporatesStore(store).corporate === null) {
    await corporatesStore(store).get()
  }
}

export default identitiesMiddleware

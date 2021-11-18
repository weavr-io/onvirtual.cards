import { Middleware } from '~/node_modules/@nuxt/types'
import { accountsStore, cardsStore } from '~/utils/store-accessor'

const instrumentsMiddleware: Middleware = async ({ store, route }) => {
  // this will run in async before every route change in order to populate identities respectively

  // const isConsumer: boolean = authStore(store).isConsumer
  // const managedAccountProfileId = isConsumer
  //   ? config.profileId.managed_accounts_consumers!
  //   : config.profileId.managed_accounts_corporates!
  //
  // const managedCardProfileId = isConsumer
  //   ? config.profileId.managed_cards_consumers!
  //   : config.profileId.managed_cards_corporates!

  if (accountsStore(store).accounts === null && route.name?.includes('managed-accounts')) {
    await accountsStore(store).index()
  }

  if (cardsStore(store).cards === null && route.name?.includes('managed-cards')) {
    // await cardsStore(store).get(managedCardProfileId)
  }
}

export default instrumentsMiddleware

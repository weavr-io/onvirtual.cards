import { Store } from 'vuex'
import * as root from './root'
import Cards from '~/store/cards'
import Accounts from '~/store/accounts'
import Corporates from '~/store/corporates'
import { initialiseStores } from '~/utils/store-accessor'
import Loader from '~/store/loader'
import Auth from '~/store/auth'
import SecureClient from '~/store/secureClient'
import Consumers from '~/store/consumers'
import Transfers from '~/store/transfers'
import Errors from '~/store/errors'
import Users from '~/store/users'
import Identity from '~/store/identity'
import AccessCodes from '~/store/accessCodes'

// More info about store: https://vuex.vuejs.org/en/core-concepts.html
// See https://nuxtjs.org/guide/vuex-store#classic-mode
// structure of the store:
// types: Types that represent the keys of the mutations to commit
// state: The information of our app, we can get or update it.
// getters: Get complex information from state
// action: Sync or async operations that commit mutations
// mutations: Modify the state

export type RootState = root.State

const initializer = (store: Store<any>) => initialiseStores(store)

const createStore = () => {
    return new Store({
        plugins: [initializer],
        state: root.state(),
        getters: root.getters,
        mutations: root.mutations,
        actions: root.actions,
        modules: {
            cardsModule: Cards,
            accountsModule: Accounts,
            corporatesModule: Corporates,
            loaderModule: Loader,
            authModule: Auth,
            secureClientModule: SecureClient,
            consumersModule: Consumers,
            identitiesModule: Identity,
            transfersModule: Transfers,
            errorsModule: Errors,
            usersModule: Users,
            accessCodesModule: AccessCodes,
        },
    })
}

export default createStore

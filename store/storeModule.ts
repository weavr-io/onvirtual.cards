import { VuexModule } from 'vuex-module-decorators'
import { Store } from '~/node_modules/vuex'

export class StoreModule extends VuexModule {
    store!: Store<any>
}

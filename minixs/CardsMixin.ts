import { Component, mixins } from '~/node_modules/nuxt-property-decorator'
import BaseMixin from '~/minixs/BaseMixin'

@Component
export default class CardsMixin extends mixins(BaseMixin) {
  get isManagedCards(): boolean {
    if (this.$route.matched[0].name) {
      return ['managed-cards', 'managed-cards-id-statements'].includes(this.$route.matched[0].name)
    } else {
      return false
    }
  }

  get cards() {
    return this.stores.cards.cards
  }

  get hasCards(): boolean {
    return this.cards?.cards ? this.cards!.cards.length > 0 : false
  }

  get cardsBalance() {
    return this.stores.cards.totalAvailableBalance
  }

  get cardCurrency() {
    return this.stores.cards
  }
}

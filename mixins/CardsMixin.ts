import { Component, mixins } from '~/node_modules/nuxt-property-decorator'
import BaseMixin from '~/mixins/BaseMixin'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import { GetManagedCardStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/GetManagedCardStatementRequest'
import CsvMixin from '~/mixins/CsvMixin'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'

@Component
export default class CardsMixin extends mixins(BaseMixin, CsvMixin) {
  get isManagedCards(): boolean {
    if (this.$route.matched[0].name) {
      return ['managed-cards', 'managed-cards-id-statements'].includes(this.$route.matched[0].name)
    } else {
      return false
    }
  }

  get managedCard() {
    return this.stores.cards.managedCard
  }

  get cardId() {
    return this.$route.params.id
  }

  get cards() {
    return this.stores.cards.cards?.cards
  }

  get hasCards(): boolean {
    return !!this.cards?.length
  }

  get cardsBalance() {
    return this.stores.cards.totalAvailableBalance
  }

  get cardCurrency() {
    return this.stores.cards
  }

  get isCardActive() {
    return this.managedCard && this.managedCard.state.state === ManagedInstrumentStateEnum.ACTIVE
  }

  downloadAsCSV(params: { id: IDModel; filters: GetManagedCardStatementRequest }) {
    const req = this.$apiMulti.managedCards.downloadStatement(params)

    req.then((res) => {
      this.downloadBlobToCsv(res.data)
    })
  }
}

import { Component, mixins } from '~/node_modules/nuxt-property-decorator'
import BaseMixin from '~/minixs/BaseMixin'
import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'

@Component
export default class CardsMixin extends mixins(BaseMixin) {
  get isManagedCards(): boolean {
    if (this.$route.matched[0].name) {
      return ['managed-cards', 'managed-cards-id-statement'].includes(this.$route.matched[0].name)
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

  get identityVerified(): boolean {
    if (this.stores.auth.isConsumer) {
      return this.stores.consumers.kyc?.fullDueDiligence === KYCStatusEnum.APPROVED
    } else {
      return this.stores.corporates.kyb?.kybStatus === KYBStatusEnum.APPROVED
    }
  }
}

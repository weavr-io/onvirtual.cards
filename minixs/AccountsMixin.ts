import { Component, mixins } from '~/node_modules/nuxt-property-decorator'
import BaseMixin from '~/minixs/BaseMixin'

@Component
export default class AccountsMixin extends mixins(BaseMixin) {
  get isManagedAccounts(): boolean {
    if (this.$route.matched[0].name) {
      return ['managed-accounts', 'managed-accounts-id'].includes(this.$route.matched[0].name)
    } else {
      return false
    }
  }

  get accountsBalance() {
    return this.stores.accounts.totalAvailableBalance
  }

  get account() {
    return this.stores.accounts.account
  }

  get hasAccount() {
    return this.stores.accounts.accounts?.accounts !== undefined
      ? this.stores.accounts.accounts.accounts.length > 0
      : false
  }
}

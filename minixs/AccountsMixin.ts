import { Component, mixins } from '~/node_modules/nuxt-property-decorator'
import BaseMixin from '~/minixs/BaseMixin'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'

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

  get accounts() {
    return this.stores.accounts.accounts
  }

  get hasAccount() {
    return this.stores.accounts.accounts?.accounts !== undefined
      ? this.stores.accounts.accounts.accounts.length > 0
      : false
  }

  goToManagedAccountIndex() {
    return this.$router.push('/managed-accounts')
  }

  get accountId(): IDModel | undefined {
    if (this.hasAccount) {
      return this.account?.id!
    } else return undefined
  }
}

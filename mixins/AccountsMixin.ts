import { Component, mixins } from '~/node_modules/nuxt-property-decorator'
import BaseMixin from '~/mixins/BaseMixin'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import { GetManagedAccountStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/GetManagedAccountStatementRequest'
import CsvMixin from '~/mixins/CsvMixin'

@Component
export default class AccountsMixin extends mixins(BaseMixin, CsvMixin) {
    get isManagedAccounts(): boolean {
        if (this.$route.matched[0].name) {
            return ['managed-accounts', 'managed-accounts-id'].includes(this.$route.matched[0].name)
        } else {
            return false
        }
    }

    get accountsBalance() {
        return this.accountStore.totalAvailableBalance
    }

    get account() {
        return this.accountStore.accountState.account
    }

    get accounts() {
        return this.accountStore.accountState.accounts
    }

    get hasAccount() {
        return this.accountStore.accountState.accounts?.accounts
            ? this.accountStore.accountState.accounts.accounts.length
            : false
    }

    get accountId(): IDModel | undefined {
        if (this.hasAccount) {
            return this.account?.id
        } else return undefined
    }

    goToManagedAccountIndex() {
        return this.$router.push('/managed-accounts')
    }

    downloadAsCSV(params: { id: IDModel; filters: GetManagedAccountStatementRequest }) {
        const req = this.$apiMulti.managedAccounts.downloadStatement(params)

        req.then((res) => {
            this.downloadBlobToCsv(res.data)
        })
    }
}

<template>
  <section>
    <b-container>
      <b-row align-h="center">
        <b-col v-if="account && !pendingDataOrError" md="9" lg="6">
          <b-row>
            <b-col>
              <h2 class="text-center font-weight-lighter">Transfer funds from your bank account to</h2>
            </b-col>
          </b-row>
          <b-row v-if="bankAccountDetails" class="pt-4">
            <b-col>
              <b-alert show variant="warning"> Please remember to include payment reference.</b-alert>
            </b-col>
          </b-row>
          <b-row class="pt-4">
            <b-col>
              <b-table-simple>
                <b-tbody>
                  <b-tr>
                    <b-th>Beneficiary</b-th>
                    <b-td>{{ beneficiaryNameAndSurname }}</b-td>
                  </b-tr>
                  <b-tr>
                    <b-th>IBAN</b-th>
                    <b-td>{{ iban }}</b-td>
                  </b-tr>
                  <b-tr v-if="sepaBic">
                    <b-th>BIC</b-th>
                    <b-td>{{ sepaBic }}</b-td>
                  </b-tr>
                  <b-tr v-if="swiftCode">
                    <b-th>Code</b-th>
                    <b-td>{{ swiftCode }}</b-td>
                  </b-tr>
                  <b-tr>
                    <b-th>Bank</b-th>
                    <b-td>{{ beneficiaryBank }}</b-td>
                  </b-tr>
                  <b-tr>
                    <b-th>Address</b-th>
                    <b-td v-html="address" />
                  </b-tr>
                  <b-tr v-if="paymentReference">
                    <b-th>Payment Reference</b-th>
                    <b-td>
                      {{ paymentReference }}
                    </b-td>
                  </b-tr>
                </b-tbody>
              </b-table-simple>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="text-center my-5">
              <b-button :to="'/managed-accounts/' + accountId" variant="secondary" class="px-5"> close</b-button>
            </b-col>
          </b-row>
        </b-col>
        <b-col v-else>
          <div class="d-flex flex-column align-items-center">
            <div class="loader-spinner">
              <b-spinner />
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { BIcon, BIconBoxArrowUpRight } from 'bootstrap-vue'
import BaseMixin from '~/mixins/BaseMixin'
import AccountsMixin from '~/mixins/AccountsMixin'
import { BankAccountDetailsModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/BankAccountDetailsModel'
import { ManagedAccountIBANModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/ManagedAccountIBANModel'
import { SepaBankDetailsModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/SepaBankDetailsModel'
import { SwiftBankDetailsModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/SwiftBankDetailsModel'

@Component({
  components: {
    BIcon,
    BIconBoxArrowUpRight,
  },
  middleware: ['kyVerified', 'instruments'],
})
export default class AccountTopupPage extends mixins(BaseMixin, AccountsMixin) {
  fetch() {
    return this.stores.accounts.getIBANDetails(this.$route.params.id)
  }

  get address() {
    return this.bankAccountDetails?.beneficiaryBankAddress?.split(',').join(',<br>')
  }

  get sepaBic() {
    if (!this.ibanDetails?.bankAccountDetails) return ''
    const i = this.ibanDetails?.bankAccountDetails.findIndex((details) => {
      return (details.details as SepaBankDetailsModel).bankIdentifierCode !== undefined
    })

    if (i >= 0) {
      return ((this.ibanDetails?.bankAccountDetails[i!] as BankAccountDetailsModel).details as SepaBankDetailsModel)
        .bankIdentifierCode
    } else {
      return ''
    }
  }

  get swiftCode() {
    if (!this.ibanDetails?.bankAccountDetails) return ''
    const i = this.ibanDetails?.bankAccountDetails.findIndex((details) => {
      return (details.details as SwiftBankDetailsModel).code !== undefined
    })

    if (i! >= 0) {
      return ((this.ibanDetails?.bankAccountDetails[i!] as BankAccountDetailsModel).details as SwiftBankDetailsModel)
        .code
    } else {
      return false
    }
  }

  get bankAccountDetails(): BankAccountDetailsModel | undefined {
    try {
      return this.ibanDetails?.bankAccountDetails[0]
    } catch (e) {
      return undefined
    }
  }

  get ibanDetails(): ManagedAccountIBANModel | null {
    return this.stores.accounts.ibanDetails
  }

  get beneficiaryNameAndSurname() {
    return this.bankAccountDetails?.beneficiaryNameAndSurname
  }

  get beneficiaryBank() {
    return this.bankAccountDetails?.beneficiaryBank
  }

  get iban() {
    return (
      (this.bankAccountDetails?.details &&
        'iban' in this.bankAccountDetails.details &&
        this.bankAccountDetails.details.iban) ||
      ''
    )
  }

  get paymentReference() {
    return this.bankAccountDetails?.paymentReference
  }
}
</script>
<style lang="scss" scoped>
ol {
  margin: 0;
  padding: 0;
  list-style-position: inside;

  li {
    margin: 0;
    padding: 16px 0;
    border-top: 1px solid #eaedf6;

    &:last-child {
      border-bottom: 1px solid #eaedf6;
    }
  }
}
</style>

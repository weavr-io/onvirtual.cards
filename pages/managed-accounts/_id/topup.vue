<template>
  <section>
    <b-container>
      <b-row>
        <b-col v-if="account && !$fetchState.pending" md="6" offset-md="3">
          <b-row>
            <b-col>
              <h2 class="text-center font-weight-lighter">
                Transfer funds from your bank account to
              </h2>
            </b-col>
          </b-row>
          <b-row v-if="bankAccountDetails" class="pt-4">
            <b-col>
              <b-alert show variant="warning">
                Please remember to include payment reference.
              </b-alert>
            </b-col>
          </b-row>
          <b-row class="pt-4">
            <b-col>
              <b-table-simple>
                <b-tbody>
                  <b-tr>
                    <b-th>Beneficiary</b-th>
                    <b-td>{{ bankAccountDetails.beneficiaryNameAndSurname }}</b-td>
                  </b-tr>
                  <b-tr>
                    <b-th>IBAN</b-th>
                    <b-td>{{ bankAccountDetails.details.iban }}</b-td>
                  </b-tr>
                  <b-tr>
                    <b-th>BIC</b-th>
                    <b-td>{{ bic }}</b-td>
                  </b-tr>
                  <b-tr>
                    <b-th>Bank</b-th>
                    <b-td>{{ bankAccountDetails.beneficiaryBank }}</b-td>
                  </b-tr>
                  <b-tr>
                    <b-th>Address</b-th>
                    <b-td v-html="address" />
                  </b-tr>
                  <b-tr v-if="bankAccountDetails.paymentReference">
                    <b-th>Payment Reference</b-th>
                    <b-td>
                      {{ bankAccountDetails.paymentReference }}
                    </b-td>
                  </b-tr>
                </b-tbody>
              </b-table-simple>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="text-center mt-5">
              <b-button :to="'/managed-accounts/' + accountId" variant="secondary" class="px-5">
                close
              </b-button>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { BIcon, BIconBoxArrowUpRight } from 'bootstrap-vue'
import BaseMixin from '~/minixs/BaseMixin'
import AccountsMixin from '~/minixs/AccountsMixin'
import { BankAccountDetailsModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/BankAccountDetailsModel'
import { ManagedAccountIBANModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/ManagedAccountIBANModel'
import { SepaBankDetailsModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/SepaBankDetailsModel'

@Component({
  components: {
    BIcon,
    BIconBoxArrowUpRight
  },
  middleware: ['kyVerified', 'instruments']
})
export default class AccountTopupPage extends mixins(BaseMixin, AccountsMixin) {
  fetch() {
    return this.stores.accounts.getIBANDetails(this.$route.params.id)
  }

  get address() {
    return this.bankAccountDetails?.beneficiaryBankAddress?.split(',').join(',<br>')
  }

  get bic() {
    const i = this.iban?.bankAccountDetails.findIndex((details) => {
      return (details.details as SepaBankDetailsModel).bankIdentifierCode !== undefined
    })

    return ((this.iban?.bankAccountDetails[i!] as BankAccountDetailsModel).details as SepaBankDetailsModel)
      .bankIdentifierCode
  }

  get bankAccountDetails(): BankAccountDetailsModel | undefined {
    try {
      return this.iban?.bankAccountDetails[0]
    } catch (e) {
      return undefined
    }
  }

  get iban(): ManagedAccountIBANModel | null {
    return this.stores.accounts.ibanDetails
  }

  mounted() {
    try {
      this.$segment.track('Account Top Up', {})
    } catch (e) {}
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

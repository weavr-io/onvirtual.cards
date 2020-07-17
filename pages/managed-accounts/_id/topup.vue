<template>
  <section>
    <b-container>
      <b-row>
        <b-col md="6" offset-md="3">
          <b-row>
            <b-col>
              <h2 class="text-center font-weight-lighter">
                Transfer funds from your bank account to
              </h2>
            </b-col>
          </b-row>
          <b-row v-if="account.bankAccountDetails.paymentReference" class="pt-4">
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
                    <b-td>{{ account.bankAccountDetails.beneficiary }}</b-td>
                  </b-tr>
                  <b-tr>
                    <b-th>IBAN</b-th>
                    <b-td>{{ account.bankAccountDetails.iban }}</b-td>
                  </b-tr>
                  <b-tr>
                    <b-th>BIC</b-th>
                    <b-td>{{ account.bankAccountDetails.bankIdentifierCode }}</b-td>
                  </b-tr>
                  <b-tr>
                    <b-th>Bank</b-th>
                    <b-td>{{ account.bankAccountDetails.beneficiaryBank }}</b-td>
                  </b-tr>
                  <b-tr>
                    <b-th>Address</b-th>
                    <b-td style="white-space: pre">
                      {{ account.bankAccountDetails.address | weavr_coma_to_newline }}
                    </b-td>
                  </b-tr>
                  <b-tr v-if="account.bankAccountDetails.paymentReference">
                    <b-th>Payment Reference</b-th>
                    <b-td>
                      {{ account.bankAccountDetails.paymentReference }}
                    </b-td>
                  </b-tr>
                </b-tbody>
              </b-table-simple>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="text-center">
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

import config from '~/config'
import BaseMixin from '~/minixs/BaseMixin'

import { accountsStore, corporatesStore } from '~/utils/store-accessor'

@Component({
  components: {
    BIcon,
    BIconBoxArrowUpRight
  }
})
export default class AccountTopupPage extends mixins(BaseMixin) {
  get account() {
    return this.stores.accounts.account
  }

  async asyncData({ store, route, redirect }) {
    const accountId = route.params.id
    let approved = false

    const _isConsumer = store.getters['auth/isConsumer']
    const _isCorporate = store.getters['auth/isCorporate']

    if (config.app.kyb_required === true) {
      if (_isConsumer) {
        // await ConsumersStore.Helpers.checkKYC(store).then(
        //   () => {
        //     approved = true
        //   },
        //   () => {
        //     approved = false
        //   }
        // )
      }
      if (_isCorporate) {
        await corporatesStore(store)
          .checkKYB()
          .then(
            () => {
              approved = true
            },
            () => {
              approved = false
            }
          )
      }
    } else {
      approved = true
    }

    if (approved) {
      await accountsStore(store).get(accountId)
    } else {
      // if (_isConsumer) {
      //   redirect('/managed-accounts/kyc')
      // }
      if (_isCorporate) {
        redirect('/managed-accounts/kyb')
      }
    }

    return { accountId: accountId, approved: approved }
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

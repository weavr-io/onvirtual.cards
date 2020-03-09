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
          <b-row class="pt-4" v-if="account.bankAccountDetails.paymentReference">
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
                    <b-td style="white-space: pre">{{ account.bankAccountDetails.address | weavr_coma_to_newline }}</b-td>
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
import { Component } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { BIcon, BIconBoxArrowUpRight } from 'bootstrap-vue'
import { VueWithRouter } from '~/base/classes/VueWithRouter'

import * as AccountsStore from '~/store/modules/Accounts'
import * as CorporatesStore from '~/store/modules/Corporates'
import * as ConsumersStore from '~/store/modules/Consumers'
import { ManagedAccountsSchemas } from '~/api/ManagedAccountsSchemas'
import config from '~/config'

import ManagedAccount = ManagedAccountsSchemas.ManagedAccount

const Accounts = namespace(AccountsStore.name)

@Component({
  components: {
    BIcon,
    BIconBoxArrowUpRight
  }
})
export default class AccountTopupPage extends VueWithRouter {
  @Accounts.Getter account!: ManagedAccount | null

  async asyncData({ store, route, redirect }) {
    const accountId = route.params.id
    let approved = false

    if (config.app.kyb_required === true) {
      if (store.getters['auth/isConsumer']) {
        await ConsumersStore.Helpers.checkKYC(store).then(
          () => {
            approved = true
          },
          () => {
            approved = false
          }
        )
      }
      if (store.getters['auth/isCorporate']) {
        await CorporatesStore.Helpers.checkKYB(store).then(
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
      await AccountsStore.Helpers.get(store, accountId)
    } else {
      redirect('/managed-accounts/kyb')
    }

    return { accountId: accountId, approved: approved }
  }

  mounted() {
    super.mounted()
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

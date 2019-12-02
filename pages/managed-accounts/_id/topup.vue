<template>
  <section>
    <b-container>
      <b-row>
        <b-col md="6" offset-md="3">
          <b-row>
            <b-col>
              <h2 class="text-center font-weight-lighter">Transfer funds from your bank account to</h2>
            </b-col>
          </b-row>
          <b-row class="py-5">
            <b-col>
              <b-table-simple>
                <b-tbody>
                  <b-tr>
                    <b-th>Beneficiary</b-th>
                    <b-td>Enterprise Ltd</b-td>
                  </b-tr>
                  <b-tr>
                    <b-th>IBAN</b-th>
                    <b-td>GB79246677 XXXXXXX XXXXX</b-td>
                  </b-tr>
                  <b-tr>
                    <b-th>BIC</b-th>
                    <b-td>GB2379</b-td>
                  </b-tr>
                  <b-tr>
                    <b-th>Bank</b-th>
                    <b-td>Barclays</b-td>
                  </b-tr>
                  <b-tr>
                    <b-th>Address</b-th>
                    <b-td>
                      Barclays
                      <br />London
                      <br />UK
                    </b-td>
                  </b-tr>
                </b-tbody>
              </b-table-simple>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="text-center">
              <b-button variant="primary" class="px-5" :to="'/managed-accounts/' + accountId">close</b-button>
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
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import { ManagedAccountsSchemas } from '~/api/ManagedAccountsSchemas'

import * as AccountsStore from '~/store/modules/Accounts'
const Accounts = namespace(AccountsStore.name)

@Component({
  components: {}
})
export default class AccountTopupPage extends VueWithRouter {
  async asyncData({ store, route }) {
    let accountId = route.params.id

    return { accountId: accountId }
  }
}
</script>

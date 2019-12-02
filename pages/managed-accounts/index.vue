<template>
  <section>
    <b-container class="mb-5">
      <b-row>
        <b-col class="text-right">
          <b-button to="/managed-accounts/add" variant="border-primary">+ add new account</b-button>
        </b-col>
      </b-row>
    </b-container>
    <b-container>
      <b-row>
        <b-col>
          <b-card-group columns v-if="accounts">
            <b-card
              v-for="(account, key) in accounts.account"
              :key="key"
              no-body
              class="mb-3 border-0 account-card shadow-hover-sm"
              bg-variant="card"
            >
              <b-card-body>
                <b-link :to="'/managed-accounts/'+account.id.id">
                  <b-card-title class="account-friendly-name">{{ account.friendlyName }}</b-card-title>
                  <p class="account-currency">{{account.currency}}</p>
                  <b-row class="account-bottom-row">
                    <b-col>
                      <div
                        class="account-available-balance"
                      >{{account.balances.availableBalance | weavr_currency(account.currency)}}</div>
                    </b-col>
                    <b-col class="text-right">-></b-col>
                  </b-row>
                </b-link>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { VueWithRouter } from '~/base/classes/VueWithRouter'

import * as AccountsStore from '~/store/modules/Accounts'
const Accounts = namespace(AccountsStore.name)

@Component({
  layout: 'dashboard'
})
export default class CardsPage extends VueWithRouter {
  @Accounts.Getter accounts

  asyncData({ store }) {
    return store.dispatch('accounts/index')
  }
}
</script>

<template>
  <section>
    <pre>
      {{ hasAccount }}
    </pre>
    <pre>
      {{ identityVerified }}
    </pre>
    <template v-if="!hasAccount && identityVerified && !$fetchState.pending">
      <b-container class="mb-5 mt-n4">
        <b-row align-v="center">
          <b-col class="text-right">
            <b-button to="/managed-accounts/add" variant="border-primary">
              + add new account
            </b-button>
          </b-col>
        </b-row>
      </b-container>
      <b-container class="mt-5">
        <b-row>
          <b-col class="py-5 text-center">
            <h4 class="font-weight-light">
              You do not have an account.
            </h4>
            <h5 class="font-weight-lighter">
              Click
              <b-link to="/managed-cards/add">
                add new account
              </b-link>
              to create your first account.
            </h5>
          </b-col>
        </b-row>
      </b-container>
    </template>
    <template v-else>
      <div class="d-flex justify-content-center">
        <div class="loader-spinner">
          <b-spinner />
        </div>
      </div>
    </template>
  </section>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '~/minixs/BaseMixin'
import AccountsMixin from '~/minixs/AccountsMixin'

@Component({
  layout: 'dashboard',
  middleware: ['kyVerified']
})
export default class IndexPage extends mixins(BaseMixin, AccountsMixin) {
  fetch() {
    return this.stores.accounts.index()
  }

  // async asyncData({ store, redirect }) {
  //   let _accountId
  //   const _accounts = await accountsStore(store).index()
  //
  //   if (_accounts.data.count >= 1) {
  //     _accountId = _accounts.data.account[0].id.id
  //     redirect('/managed-accounts/' + _accountId)
  //   }
  //
  //   return { accountId: _accountId }
  // }
}
</script>

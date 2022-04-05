<template>
  <section>
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
      <div class="d-flex flex-column align-items-center">
        <div class="loader-spinner ">
          <b-spinner />
        </div>
      </div>
    </template>
  </section>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '~/mixins/BaseMixin'
import AccountsMixin from '~/mixins/AccountsMixin'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'

@Component({
  layout: 'dashboard',
  middleware: ['kyVerified']
})
export default class IndexPage extends mixins(BaseMixin, AccountsMixin) {
  fetch() {
    return this.stores.accounts
      .index({
        profileId: this.stores.auth.isConsumer
          ? this.$config.profileId.managed_accounts_consumers!
          : this.$config.profileId.managed_accounts_corporates!,
        state: ManagedInstrumentStateEnum.ACTIVE,
        offset: '0'
      })
      .then((res) => {
        if (parseInt(res.data.count!) >= 1 && res.data.accounts) {
          const _accountId = res.data.accounts[0].id
          this.$router.push('/managed-accounts/' + _accountId)
        }
      })
      .catch((err) => {
        const data = err.response.data

        const error = data.message ? data.message : data.errorCode

        this.showErrorToast(error)
      })
  }
}
</script>

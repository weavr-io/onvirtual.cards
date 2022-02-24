<template>
  <div>
    <b-container>
      <b-row class="py-5">
        <b-col class="text-center" md="6" offset-md="3">
          <b-spinner label="Loading..." />

          <h2 class="mt-4">
            Please wait a moment.
          </h2>
          <p>We are updating your account status.</p>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '~/minixs/BaseMixin'
import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'

@Component({
  middleware: ['kyVerified']
})
export default class KycPage extends mixins(BaseMixin) {
  private tries: number = 0

  mounted() {
    this.KycApproved()
  }

  async KycApproved() {
    const _res = await this.stores.consumers.getKYC()

    if (
      _res.data.fullDueDiligence === KYCStatusEnum.APPROVED ||
      _res.data.fullDueDiligence === KYCStatusEnum.PENDING_REVIEW
    ) {
      this.redirectToAccountPage()
    } else {
      this.tries++

      if (this.tries > 3) {
        this.redirectToAccountPage()
      } else {
        await this.sleep(5000)
        this.KycApproved()
      }
    }
  }

  async redirectToAccountPage() {
    const _accounts = await this.stores.accounts.index({
      profileId: this.stores.auth.isConsumer
        ? this.$config.profileId.managed_accounts_consumers!
        : this.$config.profileId.managed_accounts_corporates!,
      state: ManagedInstrumentStateEnum.ACTIVE,
      offset: '0'
    })

    if (+_accounts.data.count! >= 1 && _accounts.data.accounts) {
      const _accountId = _accounts.data.accounts[0].id
      this.$router.push('/managed-accounts/' + _accountId)
    } else {
      this.$router.push('/managed-accounts')
    }
  }
}
</script>

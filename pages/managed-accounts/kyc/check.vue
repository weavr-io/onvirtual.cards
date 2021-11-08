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
import { FullDueDiligence } from '~/api/Enums/Consumers/FullDueDiligence'
import BaseMixin from '~/minixs/BaseMixin'

@Component
export default class KycPage extends mixins(BaseMixin) {
  private tries: number = 0

  mounted() {
    this.KycApproved()
  }

  async KycApproved() {
    const _id = this.stores.auth.identityId
    if (_id != null) {
      const _consumer = await this.stores.consumers.get(_id)

      if (
        _consumer.data.kyc?.fullDueDiligence === FullDueDiligence.APPROVED ||
        _consumer.data.kyc?.fullDueDiligence === FullDueDiligence.PENDING_REVIEW
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
  }

  async redirectToAccountPage() {
    const _accounts = await this.stores.accounts.index()

    if (_accounts.data.count >= 1) {
      const _accountId = _accounts.data.account[0].id.id
      this.$router.push('/managed-accounts/' + _accountId)
    } else {
      this.$router.push('/managed-accounts')
    }
  }
}
</script>

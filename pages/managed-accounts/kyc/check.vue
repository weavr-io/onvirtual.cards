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
import { Component } from 'nuxt-property-decorator'
import * as AuthStore from '../../../store/modules/Auth'
import * as ConsumersStore from '../../../store/modules/Consumers'
import { FullDueDiligence } from '~/api/Enums/Consumers/FullDueDiligence'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as AccountsStore from '~/store/modules/Accounts'

@Component({
  components: {}
})
export default class KycPage extends VueWithRouter {
  private tries: number = 0

  mounted() {
    this.KycApproved()
  }

  async KycApproved() {
    const _id = AuthStore.Helpers.identityId(this.$store)
    if (_id != null) {
      const _consumer = await ConsumersStore.Helpers.get(this.$store, _id)

      if (_consumer.data.kyc?.fullDueDiligence === FullDueDiligence.APPROVED) {
        this.redirectToAccountPage()
      } else {
        this.tries++

        if (this.tries > 3) {
          this.$bvModal
            .msgBoxOk('It seems to be taking more than usual. Please refresh the page in a few minutes.', {
              title: 'Something is wrong.',
              centered: true
            })
            .then(() => {
              this.redirectToAccountPage()
            })
        } else {
          await this.sleep(5000)
          this.KycApproved()
        }
      }
    }
  }

  async redirectToAccountPage() {
    const _accounts = await AccountsStore.Helpers.index(this.$store)

    if (_accounts.data.count === 1) {
      const _accountId = _accounts.data.account[0].id.id
      this.$router.push('/managed-accounts/' + _accountId)
    }
  }
}
</script>

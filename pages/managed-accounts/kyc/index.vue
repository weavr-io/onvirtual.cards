<template>
  <section>
    <b-container>
      <b-row>
        <b-col>
          <iframe id="iframe" :src="redirectUrl" style="width:100%; height:800px;" allow="camera *;" frameborder="0" />
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as AuthStore from '~/store/modules/Auth'
import * as ConsumersStore from '~/store/modules/Consumers'
import * as AccountsStore from '~/store/modules/Accounts'
import { FullDueDiligence } from '~/api/Enums/Consumers/FullDueDiligence'

@Component({
  components: {}
})
export default class KycPage extends VueWithRouter {
  redirectUrl!: string

  async asyncData({ store, redirect }) {
    const _consumerId = AuthStore.Helpers.identityId(store)

    try {
      const _res = await ConsumersStore.Helpers.startKYC(store, _consumerId)
      return { redirectUrl: _res.data.redirectUrl }
    } catch (e) {
      if (e.response.data.errorCode === 'KYC_ALREADY_APPROVED') {
        const _accounts = await AccountsStore.Helpers.index(store)

        if (_accounts.data.count === 1) {
          const _accountId = _accounts.data.account[0].id.id
          redirect('/managed-accounts/' + _accountId + '/topup')
        }
      }
    }
  }

  receiveMessage(event) {
    console.log(event)
    switch (event.data.status) {
      case 'failed':
        this.$router.push('/managed-accounts/kyc/failed')
        break
      case 'approved':
        this.KycApproved()
        break
    }
  }

  private tries: number = 0

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

  beforeMount() {
    window.addEventListener('message', this.receiveMessage, false)
  }

  beforeDestroy() {
    window.removeEventListener('message', this.receiveMessage, false)
  }
}
</script>

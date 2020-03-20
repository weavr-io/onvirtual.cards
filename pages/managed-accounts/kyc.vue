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

@Component({
  components: {}
})
export default class KycPage extends VueWithRouter {
  redirectUrl!: string

  async asyncData({ store }) {
    const _consumerId = AuthStore.Helpers.identityId(store)

    const _res = await ConsumersStore.Helpers.startKYC(store, _consumerId)

    return { redirectUrl: _res.data.redirectUrl }
  }

  mounted() {
    super.mounted()
  }

  receiveMessage(event) {
    if (event.origin === 'https://ui.idenfy.com') {
      switch (event.data.status) {
        case 'failed':
          break
        case 'success':
          AccountsStore.Helpers.index(this.$store).then((_accounts) => {
            if (_accounts.data.count === 1) {
              const _accountId = _accounts.data.account[0].id.id
              this.$router.push('/managed-accounts/' + _accountId)
            }
          })
          break
      }
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

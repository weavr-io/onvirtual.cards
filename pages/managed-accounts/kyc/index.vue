<template>
  <section>
    <b-container>
      <b-row>
        <b-col>
          <weavr-kyc :reference="reference" :options="options" />
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import * as AuthStore from '~/store/modules/Auth'
import * as ConsumersStore from '~/store/modules/Consumers'
import BaseMixin from '~/minixs/BaseMixin'
import { accountsStore } from '~/utils/store-accessor'
import WeavrKyc from '~/plugins/weavr/components/WeavrKyc.vue'
import { ConsumerVerificationFlowOptions } from '~/plugins/weavr/components/api'

@Component({
  components: { WeavrKyc }
})
export default class KycPage extends mixins(BaseMixin) {
  redirectUrl!: string

  reference!: string

  async asyncData({ store, redirect }) {
    const _consumerId = AuthStore.Helpers.identityId(store)

    try {
      const _res = await ConsumersStore.Helpers.startKYC(store, _consumerId)
      return { reference: _res.data.reference }
    } catch (e) {
      if (e.response.data.errorCode === 'KYC_ALREADY_APPROVED') {
        const _accounts = await accountsStore(store).index()

        if (_accounts.data.count >= 1) {
          const _accountId = _accounts.data.account[0].id.id
          redirect('/managed-accounts/' + _accountId + '/topup')
        }
      }
    }
  }

  options: Partial<ConsumerVerificationFlowOptions> = {
    onMessage: this.onMessage
  }

  onMessage(message, additionalInfo) {
    console.log(message, additionalInfo)
    if (message === 'kycSubmitted') {
      this.$router.push('/managed-accounts/kyc/check')
    }
  }

  receiveMessage(event) {
    console.log(event)
    switch (event.data.status) {
      case 'failed':
        this.$router.push('/managed-accounts/kyc/failed')
        break
      case 'approved':
        this.$router.push('/managed-accounts/kyc/check')
        break
    }
  }
}
</script>

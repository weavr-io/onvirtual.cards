<template>
  <section>
    <b-container>
      <b-row>
        <b-col>
          <template v-if="$fetchState.pending">
            <div class="d-flex justify-content-center">
              <div class="loader-spinner">
                <b-spinner />
              </div>
            </div>
          </template>
          <template v-else>
            <weavr-kyc :reference="reference" :options="options" />
          </template>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '~/mixins/BaseMixin'
import WeavrKyc from '~/plugins/weavr/components/WeavrKyc.vue'
import { ConsumerVerificationFlowOptions } from '~/plugins/weavr/components/api'

@Component({
  components: { WeavrKyc },
  middleware: ['kyVerified']
})
export default class KycPage extends mixins(BaseMixin) {
  redirectUrl!: string

  reference!: string

  fetch() {
    return this.stores.consumers.startKYC().then((res) => {
      this.$weavrSetUserToken('Bearer ' + this.stores.auth.token)
      this.reference = res.data.reference
    })
  }

  options: Partial<ConsumerVerificationFlowOptions> = {
    onMessage: this.onMessage
  }

  onMessage(message, additionalInfo) {
    if (message === 'kycSubmitted') {
      this.$router.push('/managed-accounts/kyc/check')
    }
  }

  receiveMessage(event) {
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

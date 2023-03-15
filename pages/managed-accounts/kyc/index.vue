<template>
  <section>
    <dashboard-header />
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
          <template v-else-if="isKycPending">
            <div class="pt-5">
              <KYCAlert />
            </div>
          </template>
          <template v-else-if="isKycRejected">
            <h3>Issues with your due diligence</h3>
            <p>The submitted documents and information were rejected.</p>
            <small class="text-muted">{{ kycErrorCode }}</small>
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
import { Component } from 'nuxt-property-decorator'
import Vue from 'vue'
import WeavrKyc from '~/plugins/weavr/components/WeavrKyc.vue'
import { ConsumerVerificationFlowOptions } from '~/plugins/weavr/components/api'
import KYCAlert from '~/components/consumers/KYCAlert.vue'
import DashboardHeader from '~/components/DashboardHeader.vue'
import { KYCErrorCodeEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCErrorCodeEnum'
import { useBase } from '~/composables/useBase'

@Component({
  components: { DashboardHeader, KYCAlert, WeavrKyc },
  middleware: ['kyVerified'],
})
export default class KycPage extends Vue {
  base = useBase(this)

  redirectUrl!: string

  reference!: string

  kycErrorCode?: KYCErrorCodeEnum | null = null

  get isKycPending() {
    return this.kycErrorCode === KYCErrorCodeEnum.KYC_PENDING_REVIEW
  }

  get isKycRejected() {
    return this.kycErrorCode === KYCErrorCodeEnum.KYC_REJECTED
  }

  fetch() {
    return this.base.stores.consumers
      .startKYC()
      .then((res) => {
        this.$weavrSetUserToken('Bearer ' + this.base.stores.auth.token)
        this.reference = res.data.reference
      })
      .catch((res) => {
        this.kycErrorCode = res.response.data.errorCode
      })
  }

  options: Partial<ConsumerVerificationFlowOptions> = {
    onMessage: this.onMessage,
  }

  onMessage(message, additionalInfo) {
    if (message === 'kycSubmitted') {
      this.$router.push('/managed-accounts/kyc/check')
    }
  }
}
</script>

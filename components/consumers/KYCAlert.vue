<template>
  <section>
    <b-container>
      <b-row v-if="isPendingReview" align-h="center">
        <b-col md="9" lg="6" class="py-3 font-weight-lighter text-center">
          <h3 class="font-weight-lighter mb-4">Your documentation is currently under review.</h3>
          <p>
            This process normally takes a few minutes. During busy times, review of documentation may take a bit longer
            up to 24 hours.
          </p>
        </b-col>
      </b-row>
      <b-row v-else align-h="center">
        <b-col md="9" lg="6" class="py-3 font-weight-lighter">
          <div>
            <h3 class="text-center font-weight-lighter mb-4">We need some documents</h3>
            <p>
              We are required by financial services regulations to perform due diligence before allowing you to transact
              with your account.
            </p>
            <p>Kindly prepare to submit and upload the following information:</p>
            <ul class="my-3 font-weight-normal">
              <li>An ID document (Passport or National ID Card)</li>
              <li>Take a selfie</li>
              <li>Two (2) documents for Proof of Address from utility bill, bank statement or driving licence</li>
            </ul>

            <h5 class="mt-4 text-center">
              <b-link to="/managed-accounts/kyc" class="link pb-2"> Start verification process</b-link>
            </h5>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'
import KyVerified from '~/mixins/kyVerified'

@Component
export default class KYCAlert extends mixins(KyVerified) {
  get isPendingReview(): boolean {
    return this.stores.consumers?.kyc?.fullDueDiligence === KYCStatusEnum.PENDING_REVIEW
  }
}
</script>

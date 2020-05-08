<template>
  <section v-if="showKycAlert">
    <b-container>
      <b-row v-if="isPendingReview">
        <b-col md="6" offset-md="3" class="py-3 font-weight-lighter text-center">
          <h3 class="font-weight-lighter mb-4">
            Your documentation is currently under review.
          </h3>
          <p>
            This process normally takes a few minutes.  During busy times, review of documentation may take a bit longer up to 24 hours.
          </p>
        </b-col>
      </b-row>
      <b-row v-else>
        <b-col md="6" offset-md="3" class="py-3 font-weight-lighter">
          <!-- <b-col class="py-5 text-center"> -->
          <div>
            <h3 class="text-center font-weight-lighter mb-4">
              We need some documents
            </h3>
            <p>
              We are required by financial services regulations to perform due diligence before allowing you to transact
              with your account.
            </p>
            <p>
              Kindly prepare to submit and upload the following information:
            </p>
            <ul class="my-3 font-weight-normal">
              <li>An ID document (Passport, National ID Card, Residence Permit)</li>
              <li>Take a selfie</li>
              <li>A utility bill showing your residential address</li>
            </ul>

            <h5 class="mt-4 text-center">
              <b-link to="/managed-accounts/kyc" class="link pb-2">
                Start verification process
              </b-link>
            </h5>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as ViewStore from '~/store/modules/View'
import * as ConsumersStore from '~/store/modules/Consumers'
import { Consumer } from '~/api/Models/Consumers/Consumer'
import { FullDueDiligence } from '~/api/Enums/Consumers/FullDueDiligence'

const View = namespace(ViewStore.name)
const Consumers = namespace(ConsumersStore.name)

@Component({})
export default class KYCAlert extends VueWithRouter {
  @View.Getter showKycAlert!: boolean

  @Consumers.Getter consumer!: Consumer | null

  get isPendingReview(): boolean {
    return this.consumer?.kyc?.fullDueDiligence === FullDueDiligence.PENDING_REVIEW
  }
}
</script>

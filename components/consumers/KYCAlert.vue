import { FullDueDiligence } from '~/api/Enums/Consumers/FullDueDiligence'
<template>
  <section v-if="showKybAlert">
    <b-container>
      <b-row>
        <b-col class="py-5 text-center">
          <div>
            <h5 class="font-weight-light">
              Your account is currently restricted.
            </h5>
            <h5 class="mt-4">
              <b-link to="/managed-accounts/kyc" class="link pb-2">
                Remove restriction
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
import { VueWithRouter } from '~/base/classes/VueWithRouter'

import * as ConsumersStore from '~/store/modules/Consumers'
import { FullDueDiligence } from '~/api/Enums/Consumers/FullDueDiligence'

@Component({})
export default class KYCAlert extends VueWithRouter {
  get showKybAlert(): boolean {
    const _consumer = ConsumersStore.Helpers.consumer(this.$store)
    if (_consumer && _consumer.kyc) {
      return _consumer.kyc.fullDueDiligence !== FullDueDiligence.APPROVED
    } else {
      return false
    }
  }
}
</script>

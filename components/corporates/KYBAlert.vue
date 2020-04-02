<template>
  <section v-if="showKybAlert">
    <b-container>
      <b-row>
        <b-col class="py-5 text-center">
          <div v-if="corporate.kyb.fullCompanyChecksVerified === 'NOT_STARTED'">
            <h5 class="font-weight-light">
              Your account is currently restricted.
            </h5>
            <h5 class="font-weight-lighter">
              We are required by financial services regulations to verify some details about your company before
              allowing you to transact with your account. For a list of the information we need, please click
              <b-link to="/managed-accounts/kyb" class="link"> here</b-link>
              .
            </h5>
          </div>
          <b-row v-if="corporate.kyb.fullCompanyChecksVerified === 'INITIATED'">
            <b-col md="8" offset-md="2">
              <h4 class="font-weight-light">
                Your account is currently under review.
              </h4>
              <h5 class="font-weight-lighter">
                Thank you for sending documentation for business verification. The documents are currently being
                reviewed - this process may take up to 3 days.
              </h5>
            </b-col>
          </b-row>
          <div v-if="corporate.kyb.fullCompanyChecksVerified === 'REJECTED'">
            <h4 class="font-weight-light">
              We're sorry but we are unable to offer you a service at this time
            </h4>
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

import * as CorporatesStore from '~/store/modules/Corporates'
import { CorporatesSchemas } from '~/api/CorporatesSchemas'
import { KYBState } from '~/api/Enums/KYBState'

const Corporates = namespace(CorporatesStore.name)

@Component({})
export default class KYBAlert extends VueWithRouter {
  @Corporates.Getter corporate!: CorporatesSchemas.Corporate | null

  accountId!: number

  get showKybAlert(): boolean {
    if (this.corporate && this.corporate.kyb) {
      return this.corporate.kyb.fullCompanyChecksVerified !== KYBState.APPROVED
    } else {
      return false
    }
  }
}
</script>

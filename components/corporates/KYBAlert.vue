<template>
  <section v-if="showKybAlert">
    <b-container>
      <b-row>
        <b-col md="6" offset-md="3" class="py-3 font-weight-lighter">
          <h3 class="text-center font-weight-lighter mb-4">
            We need some documents
          </h3>
          <p>
            We are required by financial services regulations to perform due diligence on your company before allowing
            you to transact with your account.
          </p>
          <p>
            Kindly prepare to submit and upload the following information:
          </p>
          <ul class="my-3 font-weight-normal">
            <li>Copy of the Certificate of Incorporation</li>
            <li>Copy of the Articles of Association (last amendment)</li>
            <li>
              Proof of Business Address such as a copy of a bank statement or lease agreement in the name of the
              business
            </li>
            <li>Directors: name, date of birth, address, email address</li>
            <li>
              Ultimate Beneficiary Owners (UBOs) holding a stake of 25% or more of the equity: name, date of birth,
              nationality
            </li>
          </ul>
          <div class="text-center">
            <b-button to="/managed-accounts/kyb">
              start the verification process
            </b-button>
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
import * as ViewStore from '~/store/modules/View'

const Corporates = namespace(CorporatesStore.name)
const View = namespace(ViewStore.name)

@Component({})
export default class KYBAlert extends VueWithRouter {
  @Corporates.Getter corporate!: CorporatesSchemas.Corporate | null

  accountId!: number

  @View.Getter showKybAlert!: boolean
}
</script>

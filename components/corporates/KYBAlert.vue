<template>
  <section v-if="showKybAlert">
<b-container>
      <b-row>
        <b-col md="6" offset-md="3" class="py-3 font-weight-lighter">
          <h3 class="text-center font-weight-lighter mb-4">
            We need some documents
          </h3>
          <p>
              We are required by financial services regulations to perform due diligence on your company before
              allowing you to transact with your account. 
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
            <li>List of Directors: name, date of birth, address, email address</li>
            <li>
              List of Ultimate Beneficiary Owners (UBOs) holding a stake of 25% or more of the equity: name, date of
              birth, address, nationality
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

    <!-- <b-container>
      <b-row>
        <b-col class="py-5 text-center">
          <div v-if="corporate.kyb.fullCompanyChecksVerified === 'NOT_STARTED'">
            <h5 class="font-weight-light">
              Your account is currently restricted.
            </h5>
            <p>
              We are required by financial services regulations to perform due diligence on your company before
              allowing you to transact with your account. 
              <br><br>Kindly prepare to submit the following information:
              <br><br>
              To start the verification process, please click
              <b-link to="/managed-accounts/kyb" class="link"> here</b-link>
              .
            </p>
            <ol class="my-5 font-weight-normal">
              <li>Copy of the Certificate of Incorporation</li>
              <li>Copy of the Articles of Association last amendment</li>
              <li>
                Proof of Business Address such as a copy of a bank statement or lease agreement in the name of the
                business
              </li>
              <li>List of Directors: name, date of birth, address, copy of ID document</li>
              <li>
                List of Ultimate Beneficiary Owners (UBOs) holding a stake of 10% or more of the equity: name, date of
                birth, address, nationality
              </li>
              <li>
                <a href="/ubo-declaration.docx" target="_blank" class="link"
                  >UBO declaration form <b-icon icon="box-arrow-up-right"
                /></a>
              </li>
            </ol>
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
    </b-container> -->
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

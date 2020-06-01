<template>
  <section v-if="showKybAlert">
    <b-container>
      <b-row v-if="isPendingReview">
        <b-col md="6" offset-md="3" class="py-3 font-weight-lighter text-center">
          <h3 class="font-weight-lighter mb-4">
            Your account is currently under review.
          </h3>
          <p>
            This process normally takes a few days.
          </p>
        </b-col>
      </b-row>
      <b-row v-else>
        <b-col md="6" offset-md="3" class="py-3 font-weight-lighter">
          <h3 class="text-center font-weight-lighter mb-4">
            We need some documents
          </h3>
          <p>
            We are required by financial services regulations to perform due diligence on your company before allowing
            you to transact with your account.
          </p>
          <p>
            Kindly prepare to submit and upload the following documents:
          </p>
          <ul class="my-3 font-weight-normal">
            <li>Copy of the Certificate of Incorporation</li>
            <li>Copy of the Articles of Association (last amendment)</li>
            <li>Proof of Business Address (e.g. bank statement/lease agreement)</li>
            <li>UBO Declaration Form downloadable from <a href="">here.</a></li>
            <li>Commercial registry extract showing shareholders and directors</a></li>
          </ul>
          <p>
            You will also need to provide the following information:
          </p>
          <ul class="my-3 font-weight-normal">
            <li>Directors: name, date of birth, nationality, email address, contact number</li>
            <li>Ultimate Beneficiary Owners (UBOs) holding a stake of 25% or more: name, date of birth, nationality</li>
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
import * as ViewStore from '~/store/modules/View'
import { Corporate } from '~/api/Models/Corporates/Corporate'
import { KYBState } from '~/api/Enums/KYBState'

const Corporates = namespace(CorporatesStore.name)
const View = namespace(ViewStore.name)

@Component({})
export default class KYBAlert extends VueWithRouter {
  @Corporates.Getter corporate!: Corporate | null

  accountId!: number

  @View.Getter showKybAlert!: boolean

  get isPendingReview(): boolean {
    return this.corporate?.kyb?.fullCompanyChecksVerified === KYBState.PENDING_REVIEW
  }
}
</script>

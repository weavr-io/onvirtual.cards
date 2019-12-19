<template>
  <section>
    <b-container>
      <b-row class="full-height-vh py-5" align-v="center">
        <b-col lg="6" offset-lg="3">
          <div class="mx-md-3 px-md-5">
            <div class="text-center">
              <h2 class="font-weight-lighter">Email sent</h2>
              <h5 class="font-weight-lighter mt-4">
                Check your email for a reset link. If you don’t receive this within 5 minutes, click the link below to
                resend.
              </h5>
            </div>
            <div class="mt-5 text-center">
              <div>
                <img src="/img/success.svg" alt="" style="max-width: 100px" />
              </div>
              <div>
                <b-button variant="primary" @click="goToResetPassword" class="mt-5">
                  resend
                  <span class="pl-5">-></span>
                </b-button>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { VueWithRouter } from '~/base/classes/VueWithRouter'

@Component({
  layout: 'auth'
})
export default class PasswordSentPage extends VueWithRouter {
  goToResetPassword() {
    this.$router.push('/password/reset')
  }
}
</script>

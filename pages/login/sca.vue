<template>
  <b-col md="8" offset-md="2" lg="6" offset-lg="3">
    <div class="text-center pb-5">
      <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="onvirtual.cards" />
    </div>
    <MobileComponent :verify-phone="false"
      ><template #title>Check your phone</template><template #alert>The one-time password was resent by SMS.</template>
      <template #description
        >We’ve just sent you a one-time password by SMS. Enter the 6 digit code below to verify it's really
        you.</template
      >
      <template #countdown> seconds until you can send another one-time password</template></MobileComponent
    >
  </b-col>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import Vue from 'vue'
import MobileComponent from '~/components/MobileComponent.vue'
import { identitiesStore } from '~/utils/store-accessor'

@Component({
  layout: 'auth',
  components: {
    MobileComponent,
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue'),
  },
})
export default class Sca extends Vue {
  asyncData({ store, redirect }) {
    const identities = identitiesStore(store)

    if (!identities.mobileNumberVerified) {
      return redirect('/register/verify/mobile')
    }
  }
}
</script>

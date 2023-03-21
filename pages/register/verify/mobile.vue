<template>
  <b-col md="8" offset-md="2" lg="6" offset-lg="3">
    <div class="text-center pb-5">
      <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="onvirtual.cards" />
    </div>
    <MobileComponent :verify-phone="true"
      ><template #title>Let's also verify your phone number</template
      ><template #alert>The verification code was resent by SMS.</template>
      <template #description
        >We’ve just sent you a verification code by SMS. Enter code below to verify your phone number.</template
      >
      <template #countdown> seconds until you can send another verification code</template></MobileComponent
    >
  </b-col>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import Vue from 'vue'
import { identitiesStore } from '~/utils/store-accessor'
import MobileComponent from '~/components/MobileComponent.vue'

@Component({
  layout: 'auth',
  components: {
    MobileComponent,
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue'),
  },
})
export default class Mobile extends Vue {
  asyncData({ store, redirect }) {
    const identities = identitiesStore(store)

    if (!identities.emailVerified) {
      return redirect('/register/verify')
    } else if (identities.mobileNumberVerified) {
      return redirect('/')
    }
  }
}
</script>

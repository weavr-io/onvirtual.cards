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
import { authStore } from '~/utils/store-accessor'
import MobileComponent from '~/components/MobileComponent.vue'
import { SCAOtpChannelEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAOtpChannelEnum'
import { SCAFactorStatusEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAFactorStatusEnum'

@Component({
  layout: 'auth',
  components: {
    MobileComponent,
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue'),
  },
  middleware: ['kyVerified'],
})
export default class Mobile extends Vue {
  async asyncData({ store, redirect }) {
    const auth = authStore(store)

    await auth.indexAuthFactors()

    const smsAuthFactors = auth.authFactors?.factors?.filter((factor) => factor.channel === SCAOtpChannelEnum.SMS)

    if (smsAuthFactors && smsAuthFactors[0].status !== SCAFactorStatusEnum.PENDING_VERIFICATION) {
      return redirect('/')
    }
  }
}
</script>

<template>
  <b-col md="8" offset-md="2" lg="6" offset-lg="3">
    <div class="text-center pb-5">
      <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="onvirtual.cards" />
    </div>
    <MobileComponent :verify-phone="false">
      <template #title>Check your phone</template>
      <template #alert>The one-time password was resent by SMS.</template>
      <template #description
        >We’ve just sent you a one-time password by SMS. Enter the 6 digit code below to verify it's really you.
      </template>
    </MobileComponent>
  </b-col>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import MobileComponent from '~/components/MobileComponent.vue'
import { authStore, identitiesStore } from '~/utils/store-accessor'
import { SCAFactorStatusEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAFactorStatusEnum'
import { SCAOtpChannelEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAOtpChannelEnum'
import { CredentialTypeEnum } from '~/plugins/weavr-multi/api/models/common/CredentialTypeEnum'

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
    const auth = authStore(store)

    const smsAuthFactors = auth.authFactors?.factors?.filter((factor) => factor.channel === SCAOtpChannelEnum.SMS)

    if (auth.auth?.credentials.type === CredentialTypeEnum.ROOT && !identities.emailVerified) {
      return redirect('/login/verify')
    } else if (!smsAuthFactors || smsAuthFactors[0].status === SCAFactorStatusEnum.PENDING_VERIFICATION) {
      return redirect('/profile/mobile/add')
    } else if (localStorage.getItem('stepUp') === 'TRUE') {
      return redirect('/')
    }
  }
}
</script>

<template>
    <b-col lg="6" md="9">
        <LogoOvc :link="false" classes="pb-5" />
        <MobileComponent :verify-phone="false">
            <template #title>Check your phone</template>
            <template #alert>The one-time password was resent by SMS.</template>
            <template #description
                >We’ve just sent you a one-time password by SMS. Enter the 6 digit code below to
                verify it's really you.
            </template>
        </MobileComponent>
    </b-col>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import MobileComponent from '~/components/MobileComponent.vue'
import { SCAFactorStatusEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAFactorStatusEnum'
import { SCAOtpChannelEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAOtpChannelEnum'
import { CredentialTypeEnum } from '~/plugins/weavr-multi/api/models/common/CredentialTypeEnum'
import { initialiseStores } from '~/utils/pinia-store-accessor'
import LogoOvc from '~/components/molecules/LogoOvc.vue'

@Component({
    layout: 'auth',
    components: {
        LogoOvc,
        MobileComponent,
        ErrorAlert: () => import('~/components/ErrorAlert.vue'),
        LoaderButton: () => import('~/components/atoms/LoaderButton.vue'),
    },
})
export default class Sca extends Vue {
    asyncData({ redirect }) {
        const { auth, identity } = initialiseStores(['auth', 'identity'])

        const smsAuthFactors = auth?.authState.authFactors?.factors?.filter(
            (factor) => factor.channel === SCAOtpChannelEnum.SMS,
        )

        if (
            auth?.authState.auth?.credentials.type === CredentialTypeEnum.ROOT &&
            !identity?.identityState.emailVerified
        ) {
            return redirect('/login/verify')
        } else if (
            !smsAuthFactors ||
            smsAuthFactors[0].status === SCAFactorStatusEnum.PENDING_VERIFICATION
        ) {
            return redirect('/profile/mobile/add')
        } else if (localStorage.getItem('stepUp') === 'TRUE') {
            return redirect('/')
        }
    }
}
</script>

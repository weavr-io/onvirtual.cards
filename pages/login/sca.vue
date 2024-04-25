<template>
    <b-col lg="6" md="9">
        <div class="text-center pb-5">
            <img
                alt="onvirtual.cards"
                class="d-inline-block align-top"
                src="/img/logo.svg"
                width="200"
            />
        </div>
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
import { defineComponent, useRouter } from '@nuxtjs/composition-api'
import MobileComponent from '~/components/MobileComponent.vue'
import { SCAFactorStatusEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAFactorStatusEnum'
import { SCAOtpChannelEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAOtpChannelEnum'
import { CredentialTypeEnum } from '~/plugins/weavr-multi/api/models/common/CredentialTypeEnum'
import { initialiseStores } from '~/utils/pinia-store-accessor'

export default defineComponent({
    components: { MobileComponent },
    layout: 'auth',
    setup() {
        const router = useRouter()
        const { auth, identity } = initialiseStores(['auth', 'identity'])

        const smsAuthFactors = auth?.authState.authFactors?.factors?.filter(
            (factor) => factor.channel === SCAOtpChannelEnum.SMS,
        )

        if (
            auth?.authState.auth?.credentials.type === CredentialTypeEnum.ROOT &&
            !identity?.identityState.emailVerified
        ) {
            return router.push('/login/verify')
        } else if (
            !smsAuthFactors ||
            smsAuthFactors[0].status === SCAFactorStatusEnum.PENDING_VERIFICATION
        ) {
            return router.push('/profile/mobile/add')
        } else if (localStorage.getItem('stepUp') === 'TRUE') {
            return router.push('/')
        }
    },
})
</script>

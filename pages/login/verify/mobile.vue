<template>
    <b-col lg="6" md="9">
        <LogoOvc :link="false" classes="pb-5" />
        <MobileComponent :verify-phone="true">
            <template #title>Let's also verify your phone number</template>
            <template #alert>The verification code was resent by SMS.</template>
            <template #description
                >We’ve just sent you a verification code by SMS. Enter code below to verify your
                phone number.
            </template>
            <template #countdown> seconds until you can send another verification code</template>
        </MobileComponent>
    </b-col>
</template>

<script lang="ts">
import { defineComponent, useAsync, useRouter } from '@nuxtjs/composition-api'
import { SCAOtpChannelEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAOtpChannelEnum'
import { SCAFactorStatusEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAFactorStatusEnum'
import { initialiseStores } from '~/utils/pinia-store-accessor'
import LogoOvc from '~/components/molecules/LogoOvc.vue'
import MobileComponent from '~/components/MobileComponent.vue'

export default defineComponent({
    components: {
        MobileComponent,
        LogoOvc,
    },
    layout: 'auth',
    middleware: 'kyVerified',
    setup() {
        const router = useRouter()

        const { auth } = initialiseStores(['auth'])

        useAsync(() => auth?.indexAuthFactors())

        const smsAuthFactors = auth?.authState.authFactors?.factors?.filter(
            (factor) => factor.channel === SCAOtpChannelEnum.SMS,
        )

        if (
            smsAuthFactors &&
            smsAuthFactors[0].status !== SCAFactorStatusEnum.PENDING_VERIFICATION
        ) {
            return router.push('/')
        }
    },
})
</script>

import { SCAFactorStatusEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAFactorStatusEnum'
import { SCAOtpChannelEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAOtpChannelEnum'
import { CredentialTypeEnum } from '~/plugins/weavr-multi/api/models/common/enums/CredentialTypeEnum'
import { useStores } from '~/composables/useStores'

export default defineNuxtRouteMiddleware(() => {
    const { auth, identity } = useStores(['auth', 'identity'])

    const smsAuthFactors = auth?.authState.authFactors?.factors?.filter(
        (factor) => factor.channel === SCAOtpChannelEnum.SMS,
    )

    if (
        auth?.authState.auth?.credentials.type === CredentialTypeEnum.ROOT &&
        !identity?.identityState.emailVerified
    ) {
        console.log('oops1')
        return navigateTo('/login/verify')
    } else if (
        !smsAuthFactors ||
        smsAuthFactors[0].status === SCAFactorStatusEnum.PENDING_VERIFICATION
    ) {
        console.log('oops2')
        return navigateTo('/profile/mobile/add')
    } else if (localStorage.getItem('stepUp') === 'TRUE') {
        console.log('oops3')
        return navigateTo('/')
    }
})

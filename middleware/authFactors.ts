import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
import { SCAFactorStatusEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAFactorStatusEnum'
import { SCAOtpChannelEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAOtpChannelEnum'
import { CredentialTypeEnum } from '~/plugins/weavr-multi/api/models/common/enums/CredentialTypeEnum'
import { initialiseStores } from '~/utils/pinia-store-accessor'

export default defineNuxtMiddleware(({ redirect }) => {
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
})

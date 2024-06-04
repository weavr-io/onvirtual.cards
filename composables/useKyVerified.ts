import { computed } from '@nuxtjs/composition-api'
import { useStores } from '~/composables/useStores'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'
import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'

export const useKyVerified = () => {
    const { auth, corporates, consumers, identity } = useStores([
        'auth',
        'corporates',
        'consumers',
        'identity',
    ])

    const hasAlert = computed(() => {
        return showKybAlert.value || showKycAlert.value
    })

    const showVerifyMobileAlert = computed(() => {
        return identity?.identityState.mobileNumberVerified === false
    })

    const showVerifyEmailAlert = computed(() => {
        return identity?.identityState.emailVerified === false
    })

    const showKybAlert = computed(() => {
        const _isCorporate = auth?.isCorporate

        if (!_isCorporate) {
            return false
        }

        const _corporate = corporates?.corporateState.corporate
        const _corporateKyb = corporates?.corporateState.kyb

        if (_corporate && _corporateKyb) {
            return _corporateKyb.kybStatus !== KYBStatusEnum.APPROVED
        }
        return false
    })

    const showKycAlert = computed(() => {
        const _isConsumer = auth?.isConsumer

        if (!_isConsumer) {
            return false
        }

        const _consumer = consumers?.consumerState.consumer
        const _consumerKyc = consumers?.consumerState.kyc

        if (showVerifyMobileAlert) {
            return false
        } else if (_consumer && _consumerKyc) {
            return _consumerKyc.fullDueDiligence
                ? _consumerKyc.fullDueDiligence !== KYCStatusEnum.APPROVED
                : true
        } else {
            return false
        }
    })

    return {
        hasAlert,
        showKybAlert,
        showKycAlert,
        showVerifyEmailAlert,
        showVerifyMobileAlert,
    }
}

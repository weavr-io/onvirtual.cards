import { computed } from '@nuxtjs/composition-api'
import { useStores } from './useStores'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'

export function useKyVerified() {
    const { auth, corporates, consumers, identity } = useStores([
        'auth',
        'corporates',
        'consumers',
        'identity',
    ])

    const showVerifyMobileAlert = computed(() => {
        return identity?.identityState.mobileNumberVerified === false
    })

    const showVerifyEmailAlert = computed(() => {
        return identity?.identityState.emailVerified === false
    })

    function showKybAlert() {
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
    }

    function showKycAlert() {
        const _isConsumer = auth?.isConsumer

        if (!_isConsumer) {
            return false
        }

        const _consumer = consumers?.consumerState.consumer
        const _consumerKyc = consumers?.consumerState.kyc

        if (_consumer && _consumerKyc) {
            return _consumerKyc
        }
        return false
    }
    return { showKybAlert, showKycAlert, showVerifyEmailAlert, showVerifyMobileAlert }
}

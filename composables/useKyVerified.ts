import { computed, reactive } from '~/node_modules/vue'
import { useBase } from '~/composables/useBase'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'
import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'

export function useKyVerified(root) {
    const { stores } = useBase(root)

    const hasAlert = computed(() => {
        return showKybAlert.value || showKycAlert.value
    })

    const showKybAlert = computed(() => {
        const _isCorporate = stores.auth.isCorporate

        if (!_isCorporate) {
            return false
        }

        const _corporate = stores.corporates.corporate
        const _corporateKyb = stores.corporates.kyb

        if (_corporate && _corporateKyb) {
            return _corporateKyb.kybStatus !== KYBStatusEnum.APPROVED
        } else {
            return false
        }
    })

    const showKycAlert = computed(() => {
        const _isConsumer = stores.auth.isConsumer

        if (!_isConsumer) {
            return false
        }

        const _consumer = stores.consumers.consumer
        const _consumerKyc = stores.consumers.kyc

        if (showVerifyMobileAlert.value) {
            return false
        } else if (_consumer && _consumerKyc) {
            return _consumerKyc.fullDueDiligence
                ? _consumerKyc.fullDueDiligence !== KYCStatusEnum.APPROVED
                : true
        } else {
            return false
        }
    })

    const showVerifyMobileAlert = computed(() => {
        return stores.identities.mobileNumberVerified === false
    })

    const showVerifyEmailAlert = computed(() => {
        return stores.identities.emailVerified === false
    })

    const unRefs = reactive({
        hasAlert,
        showKybAlert,
        showKycAlert,
        showVerifyMobileAlert,
        showVerifyEmailAlert,
    })

    return {
        hasAlert,
        showKybAlert,
        showKycAlert,
        showVerifyMobileAlert,
        showVerifyEmailAlert,
        unRefs,
    }
}

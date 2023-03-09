import { useBase } from '~/composables/useBase'
import { computed } from '~/node_modules/vue'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'
import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'

export function useKyVerified() {
  const { stores } = useBase()

  const hasAlert = computed(() => {
    return showKybAlert.value || showKycAlert.value
  })

  const showKybAlert = computed(() => {
    const _isCorporate = stores.value.auth.isCorporate

    if (!_isCorporate) {
      return false
    }

    const _corporate = stores.value.corporates.corporate
    const _corporateKyb = stores.value.corporates.kyb

    if (_corporate && _corporateKyb) {
      return _corporateKyb.kybStatus !== KYBStatusEnum.APPROVED
    } else {
      return false
    }
  })

  const showKycAlert = computed(() => {
    const _isConsumer = stores.value.auth.isConsumer

    if (!_isConsumer) {
      return false
    }

    const _consumer = stores.value.consumers.consumer
    const _consumerKyc = stores.value.consumers.kyc

    if (showVerifyMobileAlert.value) {
      return false
    } else if (_consumer && _consumerKyc) {
      return _consumerKyc.fullDueDiligence ? _consumerKyc.fullDueDiligence !== KYCStatusEnum.APPROVED : true
    } else {
      return false
    }
  })

  const showVerifyMobileAlert = computed(() => {
    return stores.value.identities.mobileNumberVerified === false
  })

  const showVerifyEmailAlert = computed(() => {
    return stores.value.identities.emailVerified === false
  })

  return {
    hasAlert,
    showKybAlert,
    showKycAlert,
    showVerifyMobileAlert,
    showVerifyEmailAlert,
  }
}

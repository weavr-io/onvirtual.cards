import { computed } from 'vue'
import { useBase } from '~/composables/useBase'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'
import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'

export function useKyVerified() {
    const {
        isCorporate,
        isConsumer,
        corporate,
        consumer,
        corporateKyBStatus,
        consumerKyC,
        consumerKyCStatus,
        stores,
    } = useBase()

    const hasAlert = computed(() => showKybAlert.value || showKycAlert.value)

    const showKybAlert = computed(() => {
        if (!isCorporate.value) {
            return false
        }

        if (corporate.value && corporateKyBStatus.value) {
            return corporateKyBStatus.value !== KYBStatusEnum.APPROVED
        }

        return false
    })

    const showKycAlert = computed(() => {
        if (!isConsumer.value || showVerifyMobileAlert.value) {
            return false
        }

        if (consumer.value && consumerKyC.value) {
            return consumerKyCStatus.value
                ? consumerKyCStatus.value !== KYCStatusEnum.APPROVED
                : true
        }

        return false
    })

    const showVerifyMobileAlert = computed(() => !stores.identities.mobileNumberVerified)
    const showVerifyEmailAlert = computed(() => !stores.identities.emailVerified)

    return {
        hasAlert,
        showKybAlert,
        showKycAlert,
        showVerifyMobileAlert,
        showVerifyEmailAlert,
    }
}

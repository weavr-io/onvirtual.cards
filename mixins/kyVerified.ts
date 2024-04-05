import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '~/mixins/BaseMixin'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'
import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'

@Component
export default class KyVerified extends mixins(BaseMixin) {
    get hasAlert() {
        return this.showKybAlert || this.showKycAlert
    }

    get showKybAlert() {
        const _isCorporate = this.authStore.isCorporate

        if (!_isCorporate) return false

        const _corporate = this.corporatesStore.corporateState.corporate
        const _corporateKyb = this.corporatesStore.corporateState.kyb

        if (_corporate && _corporateKyb) {
            return _corporateKyb.kybStatus !== KYBStatusEnum.APPROVED
        }

        return false
    }

    get showKycAlert() {
        const _isConsumer = this.authStore.isConsumer

        if (!_isConsumer) {
            return false
        }

        const _consumer = this.consumersStore.consumerState.consumer
        const _consumerKyc = this.consumersStore.consumerState.kyc

        if (this.showVerifyMobileAlert) {
            return false
        } else if (_consumer && _consumerKyc) {
            return _consumerKyc.fullDueDiligence
                ? _consumerKyc.fullDueDiligence !== KYCStatusEnum.APPROVED
                : true
        } else {
            return false
        }
    }

    get showVerifyMobileAlert() {
        return this.identityStore.identityState.mobileNumberVerified
    }

    get showVerifyEmailAlert() {
        return this.identityStore.identityState.emailVerified
    }
}

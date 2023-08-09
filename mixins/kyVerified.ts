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
        const _isCorporate = this.stores.auth.isCorporate

        if (!_isCorporate) {
            return false
        }

        const _corporate = this.stores.corporates.corporate
        const _corporateKyb = this.stores.corporates.kyb

        if (_corporate && _corporateKyb) {
            return _corporateKyb.kybStatus !== KYBStatusEnum.APPROVED
        } else {
            return false
        }
    }

    get showKycAlert() {
        const _isConsumer = this.stores.auth.isConsumer

        if (!_isConsumer) {
            return false
        }

        const _consumer = this.stores.consumers.consumer
        const _consumerKyc = this.stores.consumers.kyc

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
        return this.stores.identities.mobileNumberVerified === false
    }

    get showVerifyEmailAlert() {
        return this.stores.identities.emailVerified === false
    }
}

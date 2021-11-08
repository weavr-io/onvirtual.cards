import { Module } from 'vuex-module-decorators'
import { KYBState } from '~/api/Enums/KYBState'
import { authStore, consumersStore, corporatesStore } from '~/utils/store-accessor'
import { FullDueDiligence } from '~/api/Enums/Consumers/FullDueDiligence'
import { StoreModule } from '~/store/storeModule'

@Module({
  name: 'viewModule',
  namespaced: true,
  stateFactory: true
})
export default class View extends StoreModule {
  get showKybAlert() {
    const _isCorporate = authStore(this.store).isCorporate

    if (!_isCorporate) {
      return false
    }

    const _corporate = corporatesStore(this.store).corporate
    const _corporateKyb = corporatesStore(this.store).kyb
    if (_corporate && _corporateKyb) {
      return _corporateKyb.fullCompanyChecksVerified !== KYBState.APPROVED
    } else {
      return false
    }
  }

  get showKycAlert() {
    debugger
    const _isConsumer = authStore(this.store).isConsumer

    if (!_isConsumer) {
      return false
    }

    const _consumer = consumersStore(this.store).consumer

    if (this.showVerifyMobileAlert) {
      return false
    } else if (_consumer && _consumer.kyc) {
      return _consumer.kyc.fullDueDiligence ? _consumer.kyc.fullDueDiligence !== FullDueDiligence.APPROVED : true
    } else {
      return false
    }
  }

  get showVerifyMobileAlert() {
    const _consumer = consumersStore(this.store).consumer

    const _corporate = corporatesStore(this.store).corporate
    const _corporateKyb = corporatesStore(this.store).kyb

    if (_consumer && _consumer.kyc) {
      return _consumer.kyc.mobileVerified ? !_consumer.kyc.mobileVerified : true
    } else if (_corporate && _corporateKyb) {
      return _corporateKyb.rootMobileVerified ? !_corporateKyb.rootMobileVerified : true
    } else {
      return false
    }
  }

  get showVerifyEmailAlert() {
    const _consumer = consumersStore(this.store).consumer

    const _corporate = corporatesStore(this.store).corporate
    const _corporateKyb = corporatesStore(this.store).kyb

    if (_consumer && _consumer.kyc) {
      return _consumer.kyc.emailVerified ? !_consumer.kyc.emailVerified : true
    } else if (_corporate && _corporateKyb) {
      return _corporateKyb.rootEmailVerified ? !_corporateKyb.rootEmailVerified : true
    } else {
      return false
    }
  }

  get hasAlert() {
    return this.showKybAlert || this.showKycAlert
  }
}

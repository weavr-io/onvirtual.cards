import { Component, Vue } from 'nuxt-property-decorator'
import { initialiseStores } from '~/utils/store-accessor'
import { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import { DefaultSelectValueConst } from '~/models/local/constants/DefaultSelectValueConst'
import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'
import config from '~/config'

const Countries = require('~/static/json/countries.json')

@Component
export default class BaseMixin extends Vue {
  public isInvalid(item) {
    return item.$dirty ? !item.$error : null
  }

  public invalidFeedback(item, type, customMessage) {
    if (typeof customMessage !== 'undefined') {
      return customMessage
    }

    if (typeof type === 'undefined') {
      return 'Not Handled'
    } else {
      switch (type) {
        case 'required':
          return 'This is a required field.'
        case 'terms':
          return 'Please accept terms and conditions.'
        case 'email':
          return 'Please enter a valid email address.'
        case 'password':
          return 'Please enter a valid password - must be between 8 and 30 characters, and must include lowercase, uppercase, number and special characters.'
        case 'confirmPassword':
          return 'Confirmation password should be the same as password.'
        default:
          return 'Not Handled'
      }
    }
  }

  get stores() {
    return initialiseStores(this.$store)
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  get isConsumer() {
    return this.stores.auth.isConsumer
  }

  get isCorporate() {
    return this.stores.auth.isCorporate
  }

  get isLoggedIn() {
    return this.stores.auth.isLoggedIn
  }

  get identityId() {
    return this.stores.auth.identityId
  }

  get profileId() {
    return this.isConsumer
      ? config.profileId.managed_accounts_consumers!
      : config.profileId.managed_accounts_corporates!
  }

  get consumer(): ConsumerModel | null {
    return this.stores.consumers.consumer
  }

  get rootName(): string {
    if (this.isConsumer) {
      return this.stores.consumers.consumer!.rootUser.name
    } else if (this.isCorporate) {
      return this.stores.corporates.corporate!.rootUser.name
    } else return 'noname'
  }

  get rootSurname(): string {
    if (this.isConsumer) {
      return this.stores.consumers.consumer!.rootUser.surname
    } else if (this.isCorporate) {
      return this.stores.corporates.corporate!.rootUser.surname
    } else return 'nosurname'
  }

  get rootFullName(): string {
    return `${this.rootName} ${this.rootSurname}`
  }

  get corporate() {
    return this.stores.corporates.corporate
  }

  get rootUserEmail() {
    return this.isConsumer ? this.consumer?.rootUser.email : this.corporate?.rootUser.email
  }

  get countiesOptions() {
    return Countries.map((_c) => {
      return {
        text: _c.name,
        value: _c['alpha-2']
      }
    })
  }

  get countryOptionsWithDefault() {
    const _default: [any] = [{ ...DefaultSelectValueConst }]
    _default.push(...this.countiesOptions)
    return _default
  }

  get identityVerified(): boolean {
    if (this.stores.auth.isConsumer) {
      return this.stores.consumers.kyc?.fullDueDiligence === KYCStatusEnum.APPROVED
    } else {
      return this.stores.corporates.kyb?.kybStatus === KYBStatusEnum.APPROVED
    }
  }

  goToIndex() {
    return this.$router.push('/')
  }

  logout() {
    return this.stores.auth.logout()
  }
}

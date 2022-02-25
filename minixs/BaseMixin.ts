import { Component, Vue } from 'nuxt-property-decorator'
import { initialiseStores } from '~/utils/store-accessor'
import { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import { DefaultSelectValueConst } from '~/models/local/constants/DefaultSelectValueConst'
import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'

const Countries = require('~/static/json/countries.json')

@Component
export default class BaseMixin extends Vue {
  public isInvalid(item) {
    return item.$dirty ? !item.$error : null
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
      ? this.$config.profileId.managed_accounts_consumers!
      : this.$config.profileId.managed_accounts_corporates!
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

  // Usage example with InvalidFeedBack Method
  // invalidFeedback($v.formDetails.emailSender,validateVParams($v.formDetails.emailSender.$params, $v.formDetails.emailSender))
  public validateVParams(params: {}, vuelidateSchema: {}): string | null {
    const validatorKeys: string[] = Object.keys(params)
    const validationState: { key: string; value: string }[] = []

    validatorKeys.forEach((key) => {
      if (!vuelidateSchema[key]) {
        validationState.push({ key, value: vuelidateSchema[key] })
      }
    })

    if (validationState.length > 0) {
      return validationState[0].key.toString()
    } else {
      return null
    }
  }

  public invalidFeedback(_item, type, customMessage) {
    if (typeof type === 'undefined') {
      return 'Not Handled'
    } else {
      switch (type) {
        case 'required':
          return typeof customMessage !== 'undefined' ? customMessage : 'This is a required field.'
        case 'url':
          return 'Please make sure that it is a valid URL.'
        case 'terms':
          return 'Please accept terms and conditions.'
        case 'email':
          return 'Please enter a valid email address.'
        case 'password':
          return 'Please enter a valid password - must be between 8 and 30 characters, and must include lowercase, uppercase, number and special characters.'
        case 'newPassword':
          return 'Please enter a valid password - must be between 8 and 30 characters, must be different from the current password and must include lowercase, uppercase, number and special characters.'
        case 'confirmPassword':
          return 'Confirmation password should be the same as password.'
        case 'numeric':
          return 'Field must be numeric.'
        case 'maxLength':
          return typeof customMessage !== 'undefined' ? customMessage : 'This field should not exceed 50 characters.'

        case 'baseRegexValidation':
          return 'This field contains invalid characters.'
        case 'name':
          return 'This field contains invalid characters.'
        case 'surname':
          return 'This field contains invalid characters.'
        case 'tag':
          return 'This field contains invalid characters.'
        case 'mobileNumber':
          return 'This field contains invalid characters.'
        case 'feeKey':
          return 'This field contains invalid characters.'
        case 'minValue':
          return 'Please enter a greater value.'
        default:
          return 'Not Handled'
      }
    }
  }
}

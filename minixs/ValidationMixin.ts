import { Component, Vue } from 'nuxt-property-decorator'
import { minLength } from 'vuelidate/lib/validators'

@Component
export default class ValidationMixin extends Vue {
  public isInvalid(item) {
    return item.$dirty ? !item.$error : null
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
        case 'minLength':
          return typeof customMessage !== 'undefined' ? customMessage : 'This field requires at least 6 characters.'
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

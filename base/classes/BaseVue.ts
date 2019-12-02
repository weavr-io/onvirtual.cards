import { Vue } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import * as ErrorStore from '~/store/modules/Error'

const Error = namespace(ErrorStore.name)

export class BaseVue extends Vue {
  @Error.Action resetErrors

  isInvalid(item) {
    return item.$dirty ? !item.$error : null
  }

  invalidFeedback(item, type, customMessage) {
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

  mounted() {
    this.resetErrors()
  }
}

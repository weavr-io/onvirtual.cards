import { Module, Mutation } from 'vuex-module-decorators'
import { AxiosError } from 'axios'
import { ConflictResponse } from '~/plugins/weavr-multi/api/models/error/responses/ConflictResponse'
import { LoginWithPasswordConflict } from '~/plugins/weavr-multi/api/models/error/responses/LoginWithPasswordConflict'

import { StoreModule } from '~/store/storeModule'
import { ValidatePasswordConflictsEnum } from '~/plugins/weavr-multi/api/models/error/conflicts/passwords/ValidatePasswordConflictsEnum'
import { VerifyEmailRequestConflictsEnum } from '~/plugins/weavr-multi/api/models/error/conflicts/emails/VerifyEmailRequestConflictsEnum'
import { SendMobileRequestConflictsEnum } from '~/plugins/weavr-multi/api/models/error/conflicts/mobile/SendMobileRequestConflictsEnum'
import { LoginWithPasswordConflictsEnum } from '~/plugins/weavr-multi/api/models/error/conflicts/passwords/LoginWithPasswordConflictsEnum'

@Module({
  name: 'errorsModule',
  namespaced: true,
  stateFactory: true
})
export default class Errors extends StoreModule {
  errors: any = null
  conflict: any = null

  get conflictMessage() {
    if (this.conflict) {
      const _errCode = (this.conflict as ConflictResponse).errorCode
        ? (this.conflict as ConflictResponse).errorCode
        : (this.conflict as LoginWithPasswordConflict).code

      switch (_errCode) {
        case 'ROOT_EMAIL_NOT_UNIQUE':
        case 'EMAIL_NOT_UNIQUE':
          return 'This email address already exists in the system.'
        case 'USERNAME_NOT_UNIQUE':
          return 'This username already exists in the system.'
        case 'INVALID_CREDENTIALS':
          return 'Invalid Credentials'
        case 'ROOT_USERNAME_NOT_UNIQUE':
          return 'Username already exists in the system. Please try a different username.'
        case 'INVALID_NONCE_OR_MOBILE':
          return 'There is something wrong with your verification code.'
        case 'PASSWORD_INCORRECT':
          return 'Password is incorrect.'
        case LoginWithPasswordConflictsEnum.FAILED_LOGIN:
          return 'Incorrect email and password combination. If you do not have an account please click on Register.'
        case 'MOBILE_NOT_UNIQUE':
          return 'Mobile is already in use.'
        case ValidatePasswordConflictsEnum.PASSWORD_PROFILE_NOT_CONFIGURED_FOR_CREDENTIAL_TYPE:
          return 'PASSWORD_PROFILE_NOT_CONFIGURED_FOR_CREDENTIAL_TYPE'
        case ValidatePasswordConflictsEnum.PASSWORD_TOO_LONG:
          return 'Password is too long.'
        case ValidatePasswordConflictsEnum.PASSWORD_TOO_SHORT:
          return 'Password is too short.'
        case ValidatePasswordConflictsEnum.PASSWORD_TOO_SIMPLE:
          return 'Password is too simple.'
        case ValidatePasswordConflictsEnum.UNRESOLVED_IDENTITY:
          return 'UNRESOLVED_IDENTITY'
        case VerifyEmailRequestConflictsEnum.INVALID_NONCE_OR_EMAIL:
          return 'The verification code entered is invalid.'
        case SendMobileRequestConflictsEnum.FREQUENCY_EXCEEDED:
          return 'Your verification code has already been sent. Please wait a minute before resubmitting your request.'
        case SendMobileRequestConflictsEnum.RETRIES_EXCEEDED:
          return 'You have exceeded the maximum number of attempts.  Please contact support@onvirtual.cards for assistance.'
        default:
          console.log(this.conflict)
          return 'An error occurred. Please try again.'
      }
    } else {
      return null
    }
  }

  @Mutation
  SET_CONFLICT(_conflict: AxiosError) {
    if (_conflict.response) {
      this.conflict = _conflict.response.data
    }
  }

  @Mutation
  SET_ERROR(errors: any) {
    this.errors = errors
  }

  @Mutation
  RESET_ERROR() {
    this.errors = null
    this.conflict = null
  }
}

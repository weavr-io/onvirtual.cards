import { CreateIdentityConflictsEnum } from '~/plugins/weavr-multi/api/models/error/conflicts/identities/common/CreateIdentityConflictsEnum'
import { ValidatePasswordConflictsEnum } from '~/plugins/weavr-multi/api/models/error/conflicts/passwords/ValidatePasswordConflictsEnum'
import { LoginWithPasswordConflictsEnum } from '~/plugins/weavr-multi/api/models/error/conflicts/passwords/LoginWithPasswordConflictsEnum'
import { VerifyTokenConflictsEnum } from '~/plugins/weavr-multi/api/models/error/conflicts/access/VerifyTokenConflictsEnum'

export const CONFLICT_MESSAGE_CONST: Record<any, string> = {
  [CreateIdentityConflictsEnum.ROOT_EMAIL_NOT_UNIQUE]: 'This email address already exists in the system.',
  [ValidatePasswordConflictsEnum.PASSWORD_TOO_LONG]: 'Password is too long.',
  [ValidatePasswordConflictsEnum.PASSWORD_TOO_SHORT]: 'Password is too short.',
  [ValidatePasswordConflictsEnum.PASSWORD_TOO_SIMPLE]: 'Password is too simple',
  [LoginWithPasswordConflictsEnum.FAILED_LOGIN]:
    'Incorrect email and password combination. If you do not have an account please click on Register.',
  [VerifyTokenConflictsEnum.VERIFICATION_CODE_EXPIRED]: 'The verification code entered has expired.',
  [VerifyTokenConflictsEnum.VERIFICATION_CODE_INVALID]: 'The verification code entered is invalid.'
}

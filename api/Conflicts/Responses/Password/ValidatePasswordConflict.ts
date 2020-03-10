import { ValidatePasswordConflictErrorCode } from '~/api/Conflicts/Codes/Password/ValidatePasswordConflictErrorCode'
import { ConflictResponse } from '~/api/Conflicts/Responses/ConflictResponse'

export interface ValidatePasswordConflict extends ConflictResponse{
  errorCode?: ValidatePasswordConflictErrorCode
}

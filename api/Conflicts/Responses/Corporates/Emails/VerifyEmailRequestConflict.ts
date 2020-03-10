import { ConflictResponse } from '~/api/Conflicts/Responses/ConflictResponse'
import { VerifyEmailRequestConflictErrorCode } from '~/api/Conflicts/Codes/Corporates/Emails/VerifyEmailRequestConflictErrorCode'

export interface VerifyEmailRequestConflict extends ConflictResponse {
  errorCode: VerifyEmailRequestConflictErrorCode
}

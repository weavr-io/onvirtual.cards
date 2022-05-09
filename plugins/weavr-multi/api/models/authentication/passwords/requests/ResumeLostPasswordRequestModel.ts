import { SensitivePasswordModel } from '~/plugins/weavr-multi/api/models/authentication/access/models/SensitivePasswordModel'

export interface ResumeLostPasswordRequestModel {
  nonce: string
  email: string
  newPassword: SensitivePasswordModel
}

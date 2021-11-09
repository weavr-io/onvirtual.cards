import { SensitivePasswordModel } from '~/plugins/weavr-multi/api/models/authentication/models/SensitivePasswordModel'

export interface UpdatePasswordRequestModel {
  oldPassword: SensitivePasswordModel
  newPassword: SensitivePasswordModel
}

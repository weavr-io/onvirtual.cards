import { SensitivePasswordModel } from '~/plugins/weavr-multi/api/models/authentication/models/SensitivePasswordModel'

export interface CreatePasswordRequestModel {
  password: SensitivePasswordModel
}

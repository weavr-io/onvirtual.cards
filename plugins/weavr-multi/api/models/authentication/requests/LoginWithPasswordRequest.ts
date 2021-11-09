import { SensitivePasswordModel } from '~/plugins/weavr-multi/api/models/authentication/models/SensitivePasswordModel'

export interface LoginWithPasswordRequest {
  email: string
  password: SensitivePasswordModel
}

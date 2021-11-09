import { PasswordInfo } from '~/plugins/weavr-multi/api/models/passwords/models/PasswordInfo'

export interface UpdatePasswordResponseModel {
  token?: string
  passwordInfo?: PasswordInfo
}

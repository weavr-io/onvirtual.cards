import type { PasswordInfo } from '~/plugins/weavr-multi/api/models/authentication/passwords/models/PasswordInfo'

export interface UpdatePasswordResponseModel {
    token?: string
    passwordInfo?: PasswordInfo
}

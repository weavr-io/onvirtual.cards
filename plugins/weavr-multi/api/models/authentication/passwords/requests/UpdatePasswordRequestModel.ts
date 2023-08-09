import { SensitivePasswordModel } from '~/plugins/weavr-multi/api/models/authentication/access/models/SensitivePasswordModel'

export interface UpdatePasswordRequestModel {
    oldPassword: SensitivePasswordModel
    newPassword: SensitivePasswordModel
}

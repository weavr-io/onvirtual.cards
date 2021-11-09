import { IDModel } from '../../common/IDModel'
import { IdentityIdModel } from '~/plugins/weavr-multi/api/models/common/IdentityIdModel'

export interface PasswordInfo {
  identityId: IdentityIdModel
  expiryDate?: IDModel
}

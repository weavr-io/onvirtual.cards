import { IDModel } from '../../../common/models/IDModel'
import { IdentityIdModel } from '~/plugins/weavr-multi/api/models/common/models/IdentityIdModel'

export interface PasswordInfo {
    identityId: IdentityIdModel
    expiryDate?: IDModel
}

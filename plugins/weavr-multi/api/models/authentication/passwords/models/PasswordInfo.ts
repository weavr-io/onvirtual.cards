import type { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'
import type { IdentityIdModel } from '~/plugins/weavr-multi/api/models/common/models/IdentityIdModel'

export interface PasswordInfo {
    identityId: IdentityIdModel
    expiryDate?: IDModel
}

import type { IdentityIdModel } from '~/plugins/weavr-multi/api/models/common/models/IdentityIdModel'
import type { TypeIdModel } from '~/plugins/weavr-multi/api/models/common/models/TypeIdModel'

export interface LoginWithPasswordResponse {
    token: string
    identity: IdentityIdModel
    credentials: TypeIdModel
}

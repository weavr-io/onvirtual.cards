import { IdentityIdModel } from '~/plugins/weavr-multi/api/models/common/IdentityIdModel'
import { TypeIdModel } from '~/plugins/weavr-multi/api/models/common/TypeIdModel'

export interface LoginWithPasswordResponse {
    token: string
    identity: IdentityIdModel
    credentials: TypeIdModel
}

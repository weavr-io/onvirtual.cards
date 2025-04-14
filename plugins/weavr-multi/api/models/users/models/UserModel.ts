import type { IDModel } from '../../common/models/IDModel'
import type { UserIdentityModel } from '~/plugins/weavr-multi/api/models/users/models/UserIdentityModel'

export interface UserModel {
    id: IDModel
    identity: UserIdentityModel
    name: string
    surname: string
    email: string
    active: boolean
}

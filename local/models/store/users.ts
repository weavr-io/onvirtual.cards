import type { PaginatedUsersResponseModel } from '~/plugins/weavr-multi/api/models/users/response/PaginatedUsersResponseModel'
import type { UserModel } from '~/plugins/weavr-multi/api/models/users/models/UserModel'

export interface Users {
    users: PaginatedUsersResponseModel | null
    user: UserModel | null
}

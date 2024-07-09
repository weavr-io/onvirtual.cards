import type { UserModel } from '~/plugins/weavr-multi/api/models/users/models/UserModel'
import type { PaginatedResponse } from '~/plugins/weavr-multi/api/models/common/models/PaginatedResponse'

export interface PaginatedUsersResponseModel extends PaginatedResponse {
    users: UserModel[]
}

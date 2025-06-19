import { apiFetch, type ApiResponse } from '~/utils/api'
import type { CreateUserRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/CreateUserRequestModel'
import type { UserModel } from '~/plugins/weavr-multi/api/models/users/models/UserModel'
import type { UsersFilterRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/UsersFilterRequestModel'
import type { PaginatedUsersResponseModel } from '~/plugins/weavr-multi/api/models/users/response/PaginatedUsersResponseModel'
import type { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'
import type { UpdateUserRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/UpdateUserRequestModel'
import type { InviteValidateRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/InviteValidateRequestModel'
import type { InviteConsumeRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/InviteConsumeRequestModel'

export class UsersApi {
    store(body: CreateUserRequestModel): Promise<ApiResponse<UserModel>> {
        return apiFetch.post<UserModel>('/users', body)
    }

    index(filters?: UsersFilterRequestModel): Promise<ApiResponse<PaginatedUsersResponseModel>> {
        return apiFetch.get<PaginatedUsersResponseModel>('/users', { query: filters })
    }

    show(id: IDModel): Promise<ApiResponse<UserModel>> {
        return apiFetch.get<UserModel>(`/users/${id}`)
    }

    update(params: { id: IDModel; data: UpdateUserRequestModel }): Promise<ApiResponse<UserModel>> {
        return apiFetch.patch<UserModel>(`/users/${params.id}`, params.data)
    }

    activate(id: IDModel): Promise<ApiResponse<unknown>> {
        return apiFetch.post('/users/' + id + '/activate')
    }

    deactivate(id: IDModel): Promise<ApiResponse<unknown>> {
        return apiFetch.post('/users/' + id + '/deactivate')
    }

    inviteSend(id: IDModel): Promise<ApiResponse<unknown>> {
        return apiFetch.post('/users/' + id + '/invite')
    }

    inviteValidate(params: {
        id: IDModel
        data: InviteValidateRequestModel
    }): Promise<ApiResponse<unknown>> {
        return apiFetch.post('/users/' + params.id + '/invite/validate', params.data)
    }

    inviteConsume(params: {
        id: IDModel
        data: InviteConsumeRequestModel
    }): Promise<ApiResponse<unknown>> {
        return apiFetch.post('/users/' + params.id + '/invite/consume', params.data)
    }
}

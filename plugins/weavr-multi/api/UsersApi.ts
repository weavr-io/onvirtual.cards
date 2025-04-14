import type { AxiosResponse } from 'axios'
import { $axiosMulti } from '~/utils/api'
import type { CreateUserRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/CreateUserRequestModel'
import type { UserModel } from '~/plugins/weavr-multi/api/models/users/models/UserModel'
import type { UsersFilterRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/UsersFilterRequestModel'
import type { PaginatedUsersResponseModel } from '~/plugins/weavr-multi/api/models/users/response/PaginatedUsersResponseModel'
import type { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'
import type { UpdateUserRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/UpdateUserRequestModel'
import type { InviteValidateRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/InviteValidateRequestModel'
import type { InviteConsumeRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/InviteConsumeRequestModel'

export class UsersApi {
    store(body: CreateUserRequestModel): Promise<AxiosResponse<UserModel>> {
        return $axiosMulti.post<UserModel>('/users', body)
    }

    index(filters?: UsersFilterRequestModel): Promise<AxiosResponse<PaginatedUsersResponseModel>> {
        return $axiosMulti.get<PaginatedUsersResponseModel>('/users', { data: filters })
    }

    show(id: IDModel): Promise<AxiosResponse<UserModel>> {
        return $axiosMulti.get<UserModel>('/users/' + id)
    }

    update(params: {
        id: IDModel
        data: UpdateUserRequestModel
    }): Promise<AxiosResponse<UserModel>> {
        return $axiosMulti.patch<UserModel>('/users/' + params.id, params.data)
    }

    activate(id: IDModel): Promise<AxiosResponse> {
        return $axiosMulti.post('/users/' + id + '/activate')
    }

    deactivate(id: IDModel): Promise<AxiosResponse> {
        return $axiosMulti.post('/users/' + id + '/deactivate')
    }

    inviteSend(id: IDModel): Promise<AxiosResponse> {
        return $axiosMulti.post('/users/' + id + '/invite')
    }

    inviteValidate(params: {
        id: IDModel
        data: InviteValidateRequestModel
    }): Promise<AxiosResponse> {
        return $axiosMulti.post('/users/' + params.id + '/invite/validate', params.data)
    }

    inviteConsume(params: {
        id: IDModel
        data: InviteConsumeRequestModel
    }): Promise<AxiosResponse> {
        return $axiosMulti.post('/users/' + params.id + '/invite/consume', params.data)
    }
}

import { AxiosResponse } from 'axios'
import { $axiosMulti } from '~/utils/api'
import { CreateUserRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/CreateUserRequestModel'
import { UserModel } from '~/plugins/weavr-multi/api/models/users/models/UserModel'
import { UsersFilterRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/UsersFilterRequestModel'
import { PaginatedUsersResponseModel } from '~/plugins/weavr-multi/api/models/users/response/PaginatedUsersResponseModel'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'
import { UpdateUserRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/UpdateUserRequestModel'
import { InviteValidateRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/InviteValidateRequestModel'
import { InviteConsumeRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/InviteConsumeRequestModel'

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

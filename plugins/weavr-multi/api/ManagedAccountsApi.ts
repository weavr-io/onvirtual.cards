import { AxiosResponse } from 'axios'
import { IDModel } from './models/common/IDModel'
import { $axiosMulti } from '~/utils/api'
import { ManagedAccountsFilterRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/ManagedAccountsFilterRequest'
import { ManagedAccountModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/ManagedAccountModel'
import { CreateManagedAccountRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/CreateManagedAccountRequest'
import { UpdateManagedAccountRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/UpdateManagedAccountRequest'
import { PaginatedManagedAccountsResponse } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/responses/PaginatedManagedAccountsResponse'
import { ManagedAccountIBANModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/ManagedAccountIBANModel'
import { ManagedAccountsStatementsFilterRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/ManagedAccountsStatementsFilterRequest'
import { StatementResponseModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/responses/StatementResponseModel'

export class ManagedAccountsApi {
  index(filters?: ManagedAccountsFilterRequest): Promise<AxiosResponse<PaginatedManagedAccountsResponse>> {
    return $axiosMulti.get<PaginatedManagedAccountsResponse>('/managed_accounts', { params: filters })
  }

  store(request: CreateManagedAccountRequest): Promise<AxiosResponse<ManagedAccountModel>> {
    return $axiosMulti.post<ManagedAccountModel>('/managed_accounts', request)
  }

  show(id: IDModel): Promise<AxiosResponse<ManagedAccountModel>> {
    return $axiosMulti.get<ManagedAccountModel>('/managed_accounts/' + id)
  }

  update(params: { id: IDModel; data: UpdateManagedAccountRequest }): Promise<AxiosResponse<ManagedAccountModel>> {
    return $axiosMulti.patch<ManagedAccountModel>('/managed_accounts/' + params.id, params.data)
  }

  remove(id: IDModel): Promise<AxiosResponse> {
    return $axiosMulti.post('/managed_accounts/' + id + '/remove')
  }

  assignIban(id: IDModel): Promise<AxiosResponse<ManagedAccountIBANModel>> {
    return $axiosMulti.post<ManagedAccountIBANModel>('/managed_accounts/' + id + '/iban')
  }

  retrieveIban(id: IDModel): Promise<AxiosResponse<ManagedAccountIBANModel>> {
    return $axiosMulti.get<ManagedAccountIBANModel>('/managed_accounts/' + id + '/iban')
  }

  block(id: IDModel): Promise<AxiosResponse> {
    return $axiosMulti.post('/managed_accounts/' + id + '/block')
  }

  unblock(id: IDModel): Promise<AxiosResponse> {
    return $axiosMulti.post('/managed_accounts/' + id + '/unblock')
  }

  statement(params: {
    id: IDModel
    filters: ManagedAccountsStatementsFilterRequest
  }): Promise<AxiosResponse<StatementResponseModel>> {
    return $axiosMulti.get<StatementResponseModel>('/managed_accounts/' + params.id + '/statement', {
      data: params.filters
    })
  }
}

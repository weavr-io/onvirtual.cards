import type { IDModel } from './models/common/models/IDModel'
import { apiFetch, type ApiResponse } from '~/utils/api'
import type { ManagedAccountModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/ManagedAccountModel'
import type { CreateManagedAccountRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/CreateManagedAccountRequest'
import type { UpdateManagedAccountRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/UpdateManagedAccountRequest'
import type { PaginatedManagedAccountsResponse } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/responses/PaginatedManagedAccountsResponse'
import type { ManagedAccountIBANModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/ManagedAccountIBANModel'
import type { StatementResponseModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/responses/StatementResponseModel'
import type { GetManagedAccountsRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/GetManagedAccountsRequest'
import type { GetManagedAccountStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/GetManagedAccountStatementRequest'

export class ManagedAccountsApi {
    index(
        filters?: GetManagedAccountsRequest,
    ): Promise<ApiResponse<PaginatedManagedAccountsResponse>> {
        return apiFetch.get<PaginatedManagedAccountsResponse>('/managed_accounts', {
            params: filters,
        })
    }

    store(request: CreateManagedAccountRequest): Promise<ApiResponse<ManagedAccountModel>> {
        return apiFetch.post<ManagedAccountModel>('/managed_accounts', request)
    }

    show(id: IDModel): Promise<ApiResponse<ManagedAccountModel>> {
        return apiFetch.get<ManagedAccountModel>(`/managed_accounts/${id}`)
    }

    update(params: {
        id: IDModel
        data: UpdateManagedAccountRequest
    }): Promise<ApiResponse<ManagedAccountModel>> {
        return apiFetch.patch<ManagedAccountModel>(`/managed_accounts/${params.id}`, params.data)
    }

    remove(id: IDModel): Promise<ApiResponse<unknown>> {
        return apiFetch.post(`/managed_accounts/${id}/remove`)
    }

    assignIban(id: IDModel): Promise<ApiResponse<ManagedAccountIBANModel>> {
        return apiFetch.post<ManagedAccountIBANModel>(`/managed_accounts/${id}/iban`)
    }

    retrieveIban(id: IDModel): Promise<ApiResponse<ManagedAccountIBANModel>> {
        return apiFetch.get<ManagedAccountIBANModel>(`/managed_accounts/${id}/iban`)
    }

    block(id: IDModel): Promise<ApiResponse<unknown>> {
        return apiFetch.post(`/managed_accounts/${id}/block`)
    }

    unblock(id: IDModel): Promise<ApiResponse<unknown>> {
        return apiFetch.post(`/managed_accounts/${id}/unblock`)
    }

    statement(params: {
        id: IDModel
        filters: GetManagedAccountStatementRequest
    }): Promise<ApiResponse<StatementResponseModel>> {
        return apiFetch.get<StatementResponseModel>(`/managed_accounts/${params.id}/statement`, {
            params: params.filters,
        })
    }

    downloadStatement(params: { id: IDModel; filters: GetManagedAccountStatementRequest }) {
        return apiFetch.get<Blob>(`/managed_accounts/${params.id}/statement`, {
            params: params.filters,
            responseType: 'blob',
            headers: {
                Accept: 'text/csv',
            },
        })
    }
}

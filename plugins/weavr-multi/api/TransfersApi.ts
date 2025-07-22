import { apiFetch, type ApiResponse } from '~/utils/api'
import type { CreateTransferRequest } from '~/plugins/weavr-multi/api/models/transfers/requests/CreateTransferRequest'
import type { TransferModel } from '~/plugins/weavr-multi/api/models/transfers/models/TransferModel'
import type { GetTransferTransactionsResponse } from '~/plugins/weavr-multi/api/models/transfers/responses/GetTransferTransactionsResponse'
import type { GetTransferTransactionsRequest } from '~/plugins/weavr-multi/api/models/transfers/requests/GetTransferTransactionsRequest'
import type { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'

export class TransfersApi {
    index(
        filters?: GetTransferTransactionsRequest,
    ): Promise<ApiResponse<GetTransferTransactionsResponse>> {
        return apiFetch.get<GetTransferTransactionsResponse>('/transfers', { params: filters })
    }

    store(body: CreateTransferRequest): Promise<ApiResponse<TransferModel>> {
        return apiFetch.post<TransferModel>('/transfers', body)
    }

    show(id: IDModel): Promise<ApiResponse<TransferModel>> {
        return apiFetch.get<TransferModel>(`/transfers/${id}`)
    }
}

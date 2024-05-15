import { AxiosResponse } from 'axios'
import { $axiosMulti } from '~/utils/api'
import { CreateTransferRequest } from '~/plugins/weavr-multi/api/models/transfers/requests/CreateTransferRequest'
import { TransferModel } from '~/plugins/weavr-multi/api/models/transfers/models/TransferModel'
import { GetTransferTransactionsResponse } from '~/plugins/weavr-multi/api/models/transfers/responses/GetTransferTransactionsResponse'
import { GetTransferTransactionsRequest } from '~/plugins/weavr-multi/api/models/transfers/requests/GetTransferTransactionsRequest'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'

export class TransfersApi {
    index(
        filters?: GetTransferTransactionsRequest,
    ): Promise<AxiosResponse<GetTransferTransactionsResponse>> {
        return $axiosMulti.get<GetTransferTransactionsResponse>('/transfers', { params: filters })
    }

    store(body: CreateTransferRequest): Promise<AxiosResponse<TransferModel>> {
        return $axiosMulti.post<TransferModel>('/transfers', body)
    }

    show(id: IDModel): Promise<AxiosResponse<TransferModel>> {
        return $axiosMulti.get<TransferModel>('/transfers/' + id)
    }
}

import { AxiosResponse } from 'axios'
import { $axiosMulti } from '~/utils/api'
import { CreateTransferRequest } from '~/plugins/weavr-multi/api/models/transfers/requests/CreateTransferRequest'
import { TransferModel } from '~/plugins/weavr-multi/api/models/transfers/models/TransferModel'
import { GetTransferTransactionsResponse } from '~/plugins/weavr-multi/api/models/transfers/responses/GetTransferTransactionsResponse'

export class TransfersApi {
  index(GetTransferTransactionRequest): Promise<AxiosResponse<GetTransferTransactionsResponse>> {
    return $axiosMulti.get<GetTransferTransactionsResponse>('/transfers')
  }

  store(body: CreateTransferRequest): Promise<AxiosResponse<TransferModel>> {
    return $axiosMulti.post<TransferModel>('/transfers', body)
  }
}

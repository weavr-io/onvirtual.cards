import { AxiosResponse } from 'axios'
import { $axiosMulti } from '~/utils/api'
import { ConsumerModel } from '~/plugins/weavr-multi/api/models/consumers/models/ConsumerModel'
import { UpdateConsumerRequest } from '~/plugins/weavr-multi/api/models/consumers/requests/UpdateConsumerRequest'
import { GetConsumerKYCResponse } from '~/plugins/weavr-multi/api/models/consumers/responses/GetConsumerKYCResponse'
import { CreateConsumerRequest } from '~/plugins/weavr-multi/api/models/consumers/requests/CreateConsumerRequest'

export class ConsumersApi {
  store(data: CreateConsumerRequest): Promise<AxiosResponse<ConsumerModel>> {
    return $axiosMulti.post<ConsumerModel>('/consumers', data)
  }

  show(): Promise<AxiosResponse<ConsumerModel>> {
    return $axiosMulti.get<ConsumerModel>('/consumers')
  }

  update(data: UpdateConsumerRequest): Promise<AxiosResponse<ConsumerModel>> {
    return $axiosMulti.patch<ConsumerModel>('/consumers', data)
  }

  showKYC(): Promise<AxiosResponse<GetConsumerKYCResponse>> {
    return $axiosMulti.get<GetConsumerKYCResponse>('/consumers/kyc')
  }
}

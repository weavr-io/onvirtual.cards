import { AxiosResponse } from 'axios'
import { $axiosMulti } from '~/utils/api'
import { CorporateModel } from '~/plugins/weavr-multi/api/models/corporates/models/CorporateModel'
import { ConsumerModel } from '~/plugins/weavr-multi/api/models/consumers/models/ConsumerModel'
import { CreateConsumerRequest } from '~/api/Requests/Consumers/CreateConsumerRequest'
import { UpdateConsumerRequest } from '~/plugins/weavr-multi/api/models/consumers/requests/UpdateConsumerRequest'

export class ConsumersApi {
  store(data: CreateConsumerRequest): Promise<AxiosResponse<ConsumerModel>> {
    return $axiosMulti.post<ConsumerModel>('/consumers', data)
  }

  show(): Promise<AxiosResponse<ConsumerModel>> {
    return $axiosMulti.get<ConsumerModel>('/consumers')
  }

  update(data: UpdateConsumerRequest): Promise<AxiosResponse<ConsumerModel>> {
    return $axiosMulti.patch<CorporateModel>('/consumers', data)
  }
}

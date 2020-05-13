import { CreateConsumerRequest } from '~/api/Requests/Consumers/CreateConsumerRequest'

export interface UpdateConsumerRequest {
  request: Nullable<Partial<CreateConsumerRequest>>
  consumerId: number
}

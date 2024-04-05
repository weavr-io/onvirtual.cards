import type { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import type { GetConsumerKYCResponse } from '~/plugins/weavr-multi/api/models/identities/consumers/responses/GetConsumerKYCResponse'

export interface Consumers {
    isLoading: boolean
    isLoadingRegistration: boolean
    consumer: ConsumerModel | null
    kyc: GetConsumerKYCResponse | null
}

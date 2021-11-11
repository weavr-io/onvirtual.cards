import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/consumers/enums/KYCStatusEnum'

export interface GetConsumerKYCResponse {
  fullDueDiligence: KYCStatusEnum
}

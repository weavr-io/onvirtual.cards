import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'

export interface GetConsumerKYCResponse {
    fullDueDiligence: KYCStatusEnum
}

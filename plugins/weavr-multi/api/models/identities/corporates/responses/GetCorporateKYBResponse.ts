import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'

export interface GetCorporateKYBResponse {
  kybStatus: KYBStatusEnum
}

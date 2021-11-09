import { IdentityIdModel } from '~/plugins/weavr-multi/api/models/common/IdentityIdModel'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import { ConsumerSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/consumers/enums/ConsumerSourceOfFundTypeEnum'

export interface UpdateConsumerRequest {
  id: IdentityIdModel
  profileId: IDModel
  tag?: string
  // rootUser:
  creationTimestamp: number
  ipAddress: string
  acceptedTerms: boolean
  baseCurrency?: string
  feeGroup?: string
  sourceOfFunds?: ConsumerSourceOfFundTypeEnum
  sourceOfFundsOther?: string
}

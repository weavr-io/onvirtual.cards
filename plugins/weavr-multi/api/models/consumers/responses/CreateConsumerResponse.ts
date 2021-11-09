import { IdentityIdModel } from '~/plugins/weavr-multi/api/models/common/IdentityIdModel'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import { ConsumerSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/consumers/enums/ConsumerSourceOfFundTypeEnum'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'

export interface CreateConsumerResponse {
  id: IdentityIdModel
  profileId: IDModel
  tag?: string
  // rootUser: CorporateRootUserModel
  creationTimestamp: number
  ipAddress: string
  acceptedTerms: boolean
  baseCurrency?: CurrencyEnum
  feeGroup?: string
  sourceOfFunds?: ConsumerSourceOfFundTypeEnum
  sourceOfFundsOther?: string
}

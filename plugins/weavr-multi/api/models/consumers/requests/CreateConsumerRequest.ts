import { IDModel } from '../../common/IDModel'
import { ConsumerSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/consumers/enums/ConsumerSourceOfFundTypeEnum'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { ConsumersRootUserRequestModel } from '~/plugins/weavr-multi/api/models/consumers/models/ConsumersRootUserRequestModel'

export interface CreateConsumerRequest {
  profileId: IDModel
  tag?: string
  rootUser: ConsumersRootUserRequestModel
  ipAddress: string
  acceptedTerms: boolean
  baseCurrency?: CurrencyEnum
  feeGroup?: string
  sourceOfFunds: ConsumerSourceOfFundTypeEnum
  sourceOfFundsOther?: string
}

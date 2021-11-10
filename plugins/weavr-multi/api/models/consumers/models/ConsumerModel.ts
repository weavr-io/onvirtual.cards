import { IDModel } from '../../common/IDModel'
import { IdentityIdModel } from '~/plugins/weavr-multi/api/models/common/IdentityIdModel'
import { CorporateSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/CorporateSourceOfFundTypeEnum'
import { ConsumersRootUserModel } from '~/plugins/weavr-multi/api/models/consumers/models/ConsumersRootUserModel'

export interface ConsumerModel {
  id: IdentityIdModel
  profileId: IDModel
  tag?: string
  rootUser: ConsumersRootUserModel
  sourceOfFunds?: CorporateSourceOfFundTypeEnum
  sourceOfFundsOther?: string
  acceptedTerms: boolean
  ipAddress: string
  baseCurrency?: string
  feeGroup?: string
  creationTimestamp: number
}

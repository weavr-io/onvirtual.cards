import { IndustryTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/IndustryTypeEnum'
import { CorporateSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/CorporateSourceOfFundTypeEnum'
import { AddressModel } from '~/plugins/weavr-multi/api/models/common/AddressModel'
import { MobileModel } from '~/plugins/weavr-multi/api/models/corporates/models/MobileModel'
import { IdentityIdModel } from '~/plugins/weavr-multi/api/models/common/IdentityIdModel'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'

export interface UpdateCorporateRequest {
  id: IdentityIdModel
  profileId: IDModel
  tag?: string
  // rootUser: CorporateRootUserModel
  industry?: IndustryTypeEnum
  sourceOfFunds?: CorporateSourceOfFundTypeEnum
  sourceOfFundsOther?: string
  acceptedTerms: boolean
  ipAddress: string
  baseCurrency?: string
  feeGroup?: string
  creationTimestamp: number
}

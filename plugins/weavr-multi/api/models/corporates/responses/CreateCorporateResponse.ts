import { IdentityIdModel } from '~/plugins/weavr-multi/api/models/common/IdentityIdModel'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import { IndustryTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/IndustryTypeEnum'
import { CorporateSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/CorporateSourceOfFundTypeEnum'

export interface CreateCorporateResponse {
  id: IdentityIdModel
  profileId: IDModel
  tag?: string
  // rootUser: CorporateRootUserModel
  // company:
  industry: IndustryTypeEnum
  sourceOfFunds: CorporateSourceOfFundTypeEnum
  sourceOfFundsOther?: string
  acceptedTerms: boolean
  ipAddress: string
  baseCurrency: string
  feeGroup?: string
  creationTimestamp: number
}

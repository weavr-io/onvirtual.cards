import { IdentityIdModel } from '~/plugins/weavr-multi/api/models/common/IdentityIdModel'
import { IndustryTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/IndustryTypeEnum'
import { CorporateSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/CorporateSourceOfFundTypeEnum'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import { UsersRootUserModel } from '~/plugins/weavr-multi/api/models/users/models/UsersRootUserModel'

export interface GetCorporateResponse {
  id: IdentityIdModel
  profileId: IDModel
  tag?: string
  rootUser: UsersRootUserModel
  // company:
  industry: IndustryTypeEnum
  sourceOfFunds: CorporateSourceOfFundTypeEnum
  sourceOfFundsOther?: string
  acceptedTerms: boolean
  ipAddress: string
  baseCurrency: CurrencyEnum
  feeGroup?: string
  creationTimestamp: number
}

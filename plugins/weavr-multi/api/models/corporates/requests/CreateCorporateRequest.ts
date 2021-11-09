import { IDModel } from '../../common/IDModel'
import { IndustryTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/IndustryTypeEnum'
import { CorporateSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/CorporateSourceOfFundTypeEnum'
import { RootUserModel } from '~/plugins/weavr-multi/api/models/corporates/models/RootUserModel'
import { CompanyModel } from '~/plugins/weavr-multi/api/models/corporates/models/CompanyModel'

export interface CreateCorporateRequest {
  profileId: IDModel
  tag?: string
  rootUser: RootUserModel
  company: CompanyModel
  industry: IndustryTypeEnum
  sourceOfFunds: CorporateSourceOfFundTypeEnum
  sourceOfFundsOther?: string
  acceptedTerms: boolean
  ipAddress: string
  baseCurrency: string
  feeGroup?: string
}

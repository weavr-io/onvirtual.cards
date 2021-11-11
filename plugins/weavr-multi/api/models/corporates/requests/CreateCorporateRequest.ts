import { IDModel } from '../../common/IDModel'
import { IndustryTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/IndustryTypeEnum'
import { CorporateSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/CorporateSourceOfFundTypeEnum'
import { CompanyModel } from '~/plugins/weavr-multi/api/models/corporates/models/CompanyModel'
import { CorporatesRootUserRequest } from '~/plugins/weavr-multi/api/models/corporates/requests/CorporatesRootUserRequest'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'

export interface CreateCorporateRequest {
  profileId: IDModel
  tag?: string
  rootUser: CorporatesRootUserRequest
  company: CompanyModel
  industry: IndustryTypeEnum
  sourceOfFunds: CorporateSourceOfFundTypeEnum
  sourceOfFundsOther?: string
  acceptedTerms: boolean
  ipAddress: string
  baseCurrency: CurrencyEnum
  feeGroup?: string
}

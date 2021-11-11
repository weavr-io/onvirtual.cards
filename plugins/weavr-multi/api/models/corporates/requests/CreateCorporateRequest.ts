import { IDModel } from '../../common/IDModel'
import { IndustryTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/IndustryTypeEnum'
import { CorporateSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/CorporateSourceOfFundTypeEnum'
import { CorporatesRootUserRequest } from '~/plugins/weavr-multi/api/models/corporates/requests/CorporatesRootUserRequest'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { CompanyRequest } from '~/plugins/weavr-multi/api/models/corporates/requests/CompanyRequest'

export interface CreateCorporateRequest {
  profileId: IDModel
  tag?: string
  rootUser: CorporatesRootUserRequest
  company: CompanyRequest
  industry: IndustryTypeEnum
  sourceOfFunds: CorporateSourceOfFundTypeEnum
  sourceOfFundsOther?: string
  acceptedTerms: boolean
  ipAddress: string
  baseCurrency: CurrencyEnum
  feeGroup?: string
}

import { IndustryTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/IndustryTypeEnum'
import { CorporateSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/CorporateSourceOfFundTypeEnum'
import { AddressModel } from '~/plugins/weavr-multi/api/models/common/AddressModel'
import { MobileModel } from '~/plugins/weavr-multi/api/models/corporates/models/MobileModel'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'

export interface UpdateCorporateRequest {
  tag?: string
  industry?: IndustryTypeEnum
  sourceOfFunds?: CorporateSourceOfFundTypeEnum
  sourceOfFundsOther?: string
  companyBusinessAddress?: AddressModel
  feeGroup?: string
  baseCurrency?: CurrencyEnum
  name?: string
  surname?: string
  email?: string
  mobile?: MobileModel
  dateOfBirth?: {
    year?: number
    month?: number
    day?: number
  } | null
}

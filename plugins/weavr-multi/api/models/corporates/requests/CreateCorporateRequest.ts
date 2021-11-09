import { IDModel } from '../../common/IDModel'
import { AddressModel } from '~/plugins/weavr-multi/api/models/common/AddressModel'
import { CompanyTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/CompanyTypeEnum'
import { IndustryTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/IndustryTypeEnum'
import { CorporateSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/CorporateSourceOfFundTypeEnum'
import { MobileModel } from '~/plugins/weavr-multi/api/models/corporates/models/MobileModel'

export interface CreateCorporateRequest {
  profileId: IDModel
  tag?: string
  rootUser: {
    name: string
    surname: string
    email: string
    mobile: MobileModel
    companyPosition: string
  }
  company: {
    type: CompanyTypeEnum
    name: string
    businessAddress?: Nullable<AddressModel>
    registrationNumber: string
    registrationCountry: string
  }
  industry: IndustryTypeEnum
  sourceOfFunds: CorporateSourceOfFundTypeEnum
  sourceOfFundsOther?: string
  acceptedTerms: boolean
  ipAddress: string
  baseCurrency: string
  feeGroup?: string
}

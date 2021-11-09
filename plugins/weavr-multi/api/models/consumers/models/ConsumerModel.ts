import { IDModel } from '../../common/IDModel'
import { IdentityIdModel } from '~/plugins/weavr-multi/api/models/common/IdentityIdModel'
import { RootUserModel } from '~/plugins/weavr-multi/api/models/users/models/RootUserModel'
import { CompanyTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/CompanyTypeEnum'
import { LegalAddressModel } from '~/plugins/weavr-multi/api/models/corporates/models/LegalAddressModel'
import { AddressModel } from '~/plugins/weavr-multi/api/models/common/AddressModel'
import { IndustryTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/IndustryTypeEnum'
import { CorporateSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/CorporateSourceOfFundTypeEnum'

export interface ConsumerModel {
  id: IdentityIdModel
  profileId: IDModel
  tag?: string
  rootUser: RootUserModel
  company: {
    name: string
    type: CompanyTypeEnum
    registrationNumber?: string
    registeredAddress?: LegalAddressModel
    businessAddress?: AddressModel
    countryOfRegistration: string
    incorporatedOn?: {
      year?: number
      month?: number
      day?: number
    }
  }
  industry: IndustryTypeEnum
  sourceOfFunds: CorporateSourceOfFundTypeEnum
  sourceOfFundsOther?: string
  acceptedTerms: boolean
  ipAddress: string
  baseCurrency: string
  feeGroup?: string
  creationTimestamp: number
}

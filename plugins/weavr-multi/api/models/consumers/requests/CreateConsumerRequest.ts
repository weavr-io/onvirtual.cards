import { IDModel } from '../../common/IDModel'
import { AddressModel } from '~/plugins/weavr-multi/api/models/common/AddressModel'
import { CompanyTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/CompanyTypeEnum'
import { IndustryTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/IndustryTypeEnum'
import { CorporateSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/corporates/enums/CorporateSourceOfFundTypeEnum'
import { MobileModel } from '~/plugins/weavr-multi/api/models/corporates/models/MobileModel'
import { ConsumerSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/consumers/enums/ConsumerSourceOfFundTypeEnum'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'

export interface CreateConsumerRequest {
  profileId: IDModel
  tag?: string
  rootUser: {
    name: string
    surname: string
    email: string
    mobile: MobileModel
    companyPosition: string
  }
  ipAddress: string
  acceptedTerms: boolean
  baseCurrency?: CurrencyEnum
  feeGroup?: string
  sourceOfFunds: ConsumerSourceOfFundTypeEnum
  sourceOfFundsOther?: string
}

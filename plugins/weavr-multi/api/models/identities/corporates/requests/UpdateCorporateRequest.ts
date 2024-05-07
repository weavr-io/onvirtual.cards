import { IndustryTypeEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/IndustryTypeEnum'
import { CorporateSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CorporateSourceOfFundTypeEnum'
import { AddressModel } from '~/plugins/weavr-multi/api/models/common/models/AddressModel'
import { MobileModel } from '~/plugins/weavr-multi/api/models/common/models/MobileModel'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { DateModel } from '~/plugins/weavr-multi/api/models/common/models/DateModel'

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
    dateOfBirth?: DateModel
}

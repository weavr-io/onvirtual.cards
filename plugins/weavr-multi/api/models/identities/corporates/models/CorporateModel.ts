import { IDModel } from '../../../common/models/IDModel'
import { IdentityIdModel } from '~/plugins/weavr-multi/api/models/common/models/IdentityIdModel'
import { IndustryTypeEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/IndustryTypeEnum'
import { CorporateSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CorporateSourceOfFundTypeEnum'
import { CorporatesRootUserModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/CorporatesRootUserModel'
import { CompanyModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/CompanyModel'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'

export interface CorporateModel {
    id: IdentityIdModel
    profileId: IDModel
    tag?: string
    rootUser: CorporatesRootUserModel
    company: CompanyModel
    industry: IndustryTypeEnum
    sourceOfFunds: CorporateSourceOfFundTypeEnum
    sourceOfFundsOther?: string
    acceptedTerms: boolean
    ipAddress: string
    baseCurrency: CurrencyEnum
    feeGroup?: string
    creationTimestamp: number
}

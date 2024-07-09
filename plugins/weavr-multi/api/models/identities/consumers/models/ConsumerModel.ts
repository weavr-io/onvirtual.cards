import type { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'
import type { IdentityIdModel } from '~/plugins/weavr-multi/api/models/common/models/IdentityIdModel'
import { CorporateSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CorporateSourceOfFundTypeEnum'
import type { ConsumersRootUserModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumersRootUserModel'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'

export interface ConsumerModel {
    id: IdentityIdModel
    profileId: IDModel
    tag?: string
    rootUser: ConsumersRootUserModel
    creationTimestamp: number
    ipAddress: string
    acceptedTerms: boolean
    baseCurrency?: CurrencyEnum
    feeGroup?: string
    sourceOfFunds?: CorporateSourceOfFundTypeEnum
    sourceOfFundsOther?: string
}

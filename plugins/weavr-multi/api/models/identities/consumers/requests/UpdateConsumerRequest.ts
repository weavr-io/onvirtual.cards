import { CorporateSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CorporateSourceOfFundTypeEnum'
import { Address } from '~/plugins/weavr-multi/api/models/common/models/Address'
import { MobileModel } from '~/plugins/weavr-multi/api/models/common/models/MobileModel'
import { OccupationTypeEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/OccupationTypeEnum'
import { DateModel } from '~/plugins/weavr-multi/api/models/common/models/DateModel'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'

export interface UpdateConsumerRequest {
    tag?: string
    name?: string
    surname?: string
    email?: string
    mobile?: MobileModel
    dateOfBirth?: DateModel
    address?: Address
    feeGroup?: string
    baseCurrency?: CurrencyEnum
    occupation?: OccupationTypeEnum
    sourceOfFunds?: CorporateSourceOfFundTypeEnum
    sourceOfFundsOther?: string
}

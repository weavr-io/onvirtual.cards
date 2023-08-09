import { IDModel } from '../../../common/IDModel'
import { ConsumerSourceOfFundTypeEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/ConsumerSourceOfFundTypeEnum'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { ConsumersRootUserRequest } from '~/plugins/weavr-multi/api/models/identities/consumers/requests/ConsumersRootUserRequest'

export interface CreateConsumerRequest {
    profileId: IDModel
    tag?: string
    rootUser: ConsumersRootUserRequest
    ipAddress: string
    acceptedTerms: boolean
    baseCurrency?: CurrencyEnum
    feeGroup?: string
    sourceOfFunds: ConsumerSourceOfFundTypeEnum
    sourceOfFundsOther?: string
}

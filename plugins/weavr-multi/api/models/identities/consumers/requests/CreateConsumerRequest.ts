import { z } from 'zod'
import { IDSchema } from '../../../common/models/IDModel'
import { CurrencyEnumSchema } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import {
    ConsumersRootUserRequestSchema,
    INITIAL_CONSUMERS_ROOT_USER_REQUEST,
} from '~/plugins/weavr-multi/api/models/identities/consumers/requests/ConsumersRootUserRequest'
import { ConsumerSourceOfFundTypeEnumSchema } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/ConsumerSourceOfFundTypeEnum'

const CreateConsumerRequestSchema = z.object({
    profileId: IDSchema,
    tag: z.string().optional(),
    rootUser: ConsumersRootUserRequestSchema,
    ipAddress: z.string(),
    acceptedTerms: z.literal<boolean>(true),
    baseCurrency: CurrencyEnumSchema,
    feeGroup: z.string().optional(),
    sourceOfFunds: ConsumerSourceOfFundTypeEnumSchema,
    sourceOfFundsOther: z.string().optional(),
})

type CreateConsumerRequest = z.infer<typeof CreateConsumerRequestSchema>

const INITIAL_CREATE_CONSUMER_REQUEST = () => {
    return {
        profileId: undefined,
        tag: undefined,
        rootUser: { ...INITIAL_CONSUMERS_ROOT_USER_REQUEST() },
        ipAddress: undefined,
        acceptedTerms: undefined,
        baseCurrency: undefined,
        feeGroup: undefined,
        sourceOfFunds: null,
        sourceOfFundsOther: null,
    } as unknown as CreateConsumerRequest
}

export { CreateConsumerRequestSchema, CreateConsumerRequest, INITIAL_CREATE_CONSUMER_REQUEST }

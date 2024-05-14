import { z } from 'zod'
import { IDSchema } from '../../../common/models/IDModel'
import { CurrencyEnumSchema } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import {
    ConsumersRootUserRequestSchema,
    INITIAL_CONSUMERS_ROOT_USER_REQUEST,
} from '~/plugins/weavr-multi/api/models/identities/consumers/requests/ConsumersRootUserRequest'
import {
    ConsumerSourceOfFundTypeEnumSchema,
    PREDEFINED_CONSUMER_SOURCE_OF_FUND,
} from '~/plugins/weavr-multi/api/models/identities/consumers/enums/ConsumerSourceOfFundTypeEnum'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'
import { LoginWithPasswordSchema } from '~/plugins/weavr-multi/api/models/authentication'

const CreateConsumerRequestSchema = z
    .object({
        profileId: IDSchema,
        tag: preprocessEmptyAsUndefined(z.string().optional()),
        rootUser: ConsumersRootUserRequestSchema,
        ipAddress: preprocessEmptyAsUndefined(z.string()),
        acceptedTerms: preprocessEmptyAsUndefined(z.literal<boolean>(true)),
        baseCurrency: CurrencyEnumSchema,
        feeGroup: preprocessEmptyAsUndefined(z.string().optional()),
        sourceOfFunds: ConsumerSourceOfFundTypeEnumSchema,
        sourceOfFundsOther: preprocessEmptyAsUndefined(z.string().optional()),
    })
    .merge(LoginWithPasswordSchema.pick({ password: true }))

const CreateConsumerFormSchema = z.intersection(
    z.discriminatedUnion('sourceOfFunds', [
        z.object({
            // Ignoring for the time being because z.enum is giving type error when used with referenced object.
            // @ts-ignore
            sourceOfFunds: z.enum(PREDEFINED_CONSUMER_SOURCE_OF_FUND),
            sourceOfFundsOther: preprocessEmptyAsUndefined(z.string().optional()),
        }),

        z.object({
            sourceOfFunds: z.literal('OTHER'),
            sourceOfFundsOther: preprocessEmptyAsUndefined(z.string()),
        }),
    ]),
    CreateConsumerRequestSchema.omit({
        sourceOfFunds: true,
        sourceOfFundsOther: true,
    }),
)
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
        sourceOfFundsOther: undefined,
    } as unknown as CreateConsumerRequest
}

export {
    CreateConsumerRequestSchema,
    CreateConsumerFormSchema,
    CreateConsumerRequest,
    INITIAL_CREATE_CONSUMER_REQUEST,
}

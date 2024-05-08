import { z } from 'zod'
import { IDSchema } from '../../../common/models/IDModel'
import { CurrencyEnumSchema } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import {
    CorporateSourceOfFundTypeEnumSchema,
    CorporatesRootUserRequestSchema,
    INITIAL_CORPORATES_ROOT_USER_REQUEST,
} from '~/plugins/weavr-multi/api/models/identities/corporates'

const CreateConsumerRequestSchema = z.object({
    profileId: IDSchema,
    tag: z.string().optional(),
    rootUser: CorporatesRootUserRequestSchema,
    ipAddress: z.string(),
    acceptedTerms: z.boolean(),
    baseCurrency: CurrencyEnumSchema,
    feeGroup: z.string().optional(),
    sourceOfFunds: CorporateSourceOfFundTypeEnumSchema,
    sourceOfFundsOther: z.string().optional(),
})

type CreateConsumerRequest = z.infer<typeof CreateConsumerRequestSchema>

const INITIAL_CREATE_CONSUMER_REQUEST = {
    profileId: undefined,
    tag: undefined,
    rootUser: { ...INITIAL_CORPORATES_ROOT_USER_REQUEST },
    ipAddress: undefined,
    acceptedTerms: undefined,
    baseCurrency: undefined,
    feeGroup: undefined,
    sourceOfFunds: undefined,
    sourceOfFundsOther: undefined,
} as unknown as CreateConsumerRequest

export { CreateConsumerRequestSchema, CreateConsumerRequest, INITIAL_CREATE_CONSUMER_REQUEST }

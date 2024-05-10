import { z } from 'zod'
import { CorporateSourceOfFundTypeEnumSchema } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CorporateSourceOfFundTypeEnum'
import {
    AddressSchema,
    INITIAL_ADDRESS,
} from '~/plugins/weavr-multi/api/models/common/models/Address'
import {
    INITIAL_MOBILE_REQUEST,
    MobileSchema,
} from '~/plugins/weavr-multi/api/models/common/models/MobileModel'
import { OccupationTypeEnumSchema } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/OccupationTypeEnum'
import {
    DateSchema,
    INITIAL_DATE_REQUEST,
} from '~/plugins/weavr-multi/api/models/common/models/DateModel'
import { CurrencyEnumSchema } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'

const UpdateConsumerRequestSchema = z
    .object({
        tag: preprocessEmptyAsUndefined(z.string()),
        name: preprocessEmptyAsUndefined(z.string()),
        surname: preprocessEmptyAsUndefined(z.string()),
        email: preprocessEmptyAsUndefined(z.string().email()),
        mobile: MobileSchema.partial(),
        dateOfBirth: DateSchema.partial(),
        address: AddressSchema.partial(),
        feeGroup: preprocessEmptyAsUndefined(z.string()),
        baseCurrency: CurrencyEnumSchema,
        occupation: OccupationTypeEnumSchema,
        sourceOfFunds: CorporateSourceOfFundTypeEnumSchema,
        sourceOfFundsOther: preprocessEmptyAsUndefined(z.string()),
    })
    .partial()

type UpdateConsumerRequest = z.infer<typeof UpdateConsumerRequestSchema>

const INITIAL_UPDATE_CONSUMER_REQUEST = () => {
    return {
        tag: undefined,
        name: undefined,
        surname: undefined,
        email: undefined,
        mobile: { ...INITIAL_MOBILE_REQUEST() },
        dateOfBirth: {
            ...INITIAL_DATE_REQUEST(),
        },
        address: {
            ...INITIAL_ADDRESS(),
        },
        feeGroup: undefined,
        baseCurrency: undefined,
        occupation: undefined,
        sourceOfFunds: undefined,
        sourceOfFundsOther: undefined,
    } as unknown as UpdateConsumerRequest
}

export { UpdateConsumerRequestSchema, UpdateConsumerRequest, INITIAL_UPDATE_CONSUMER_REQUEST }

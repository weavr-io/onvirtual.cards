import { z } from 'zod'
import { CurrencyEnumSchema } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { AddressSchema } from '~/plugins/weavr-multi/api/models/common/models/Address'
import { DateSchema } from '~/plugins/weavr-multi/api/models/common/models/DateModel'
import {
    INITIAL_MOBILE_REQUEST,
    MobileSchema,
} from '~/plugins/weavr-multi/api/models/common/models/MobileModel'
import { OccupationTypeEnumSchema } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/OccupationTypeEnum'
import { CorporateSourceOfFundTypeEnumSchema } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CorporateSourceOfFundTypeEnum'
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
        dateOfBirth: undefined,
        address: undefined,
        feeGroup: undefined,
        baseCurrency: undefined,
        occupation: undefined,
        sourceOfFunds: undefined,
        sourceOfFundsOther: undefined,
    } as unknown as UpdateConsumerRequest
}

export { INITIAL_UPDATE_CONSUMER_REQUEST, type UpdateConsumerRequest, UpdateConsumerRequestSchema }

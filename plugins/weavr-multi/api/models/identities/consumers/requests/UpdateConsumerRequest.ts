import { z } from 'zod'
import { CorporateSourceOfFundTypeEnumSchema } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CorporateSourceOfFundTypeEnum'
import { AddressSchema } from '~/plugins/weavr-multi/api/models/common/models/Address'
import { MobileSchema } from '~/plugins/weavr-multi/api/models/common/models/MobileModel'
import { OccupationTypeEnumSchema } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/OccupationTypeEnum'
import { DateSchema } from '~/plugins/weavr-multi/api/models/common/models/DateModel'
import { CurrencyEnumSchema } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'

const UpdateConsumerRequestSchema = z.object({
    tag: preprocessEmptyAsUndefined(z.string().optional()),
    name: preprocessEmptyAsUndefined(z.string().optional()),
    surname: preprocessEmptyAsUndefined(z.string().optional()),
    email: preprocessEmptyAsUndefined(z.string().email().nullable().optional()),
    mobile: MobileSchema.optional(),
    dateOfBirth: DateSchema.optional(),
    address: AddressSchema.optional(),
    feeGroup: preprocessEmptyAsUndefined(z.string().optional()),
    baseCurrency: CurrencyEnumSchema.optional(),
    occupation: OccupationTypeEnumSchema.optional(),
    sourceOfFunds: CorporateSourceOfFundTypeEnumSchema.optional(),
    sourceOfFundsOther: preprocessEmptyAsUndefined(z.string().optional()),
})

type UpdateConsumerRequest = z.infer<typeof UpdateConsumerRequestSchema>

const INITIAL_UPDATE_CONSUMER_REQUEST = () => {
    return {
        tag: undefined,
        name: undefined,
        surname: undefined,
        email: undefined,
        mobile: undefined,
        dateOfBirth: undefined,
        address: undefined,
        feeGroup: undefined,
        baseCurrency: undefined,
        occupation: undefined,
        sourceOfFunds: undefined,
        sourceOfFundsOther: undefined,
    } as unknown as UpdateConsumerRequest
}

export { UpdateConsumerRequestSchema, UpdateConsumerRequest, INITIAL_UPDATE_CONSUMER_REQUEST }

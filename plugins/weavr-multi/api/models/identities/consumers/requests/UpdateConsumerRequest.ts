import { z } from 'zod'
import { CorporateSourceOfFundTypeEnumSchema } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CorporateSourceOfFundTypeEnum'
import { AddressSchema } from '~/plugins/weavr-multi/api/models/common/models/Address'
import { MobileSchema } from '~/plugins/weavr-multi/api/models/common/models/MobileModel'
import { OccupationTypeEnumSchema } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/OccupationTypeEnum'
import { DateSchema } from '~/plugins/weavr-multi/api/models/common/models/DateModel'
import { CurrencyEnumSchema } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'

const UpdateConsumerRequestSchema = z.object({
    tag: z.string().optional(),
    name: z.string().optional(),
    surname: z.string().optional(),
    email: z.string().email().nullable().optional(),
    mobile: MobileSchema.optional(),
    dateOfBirth: DateSchema.optional(),
    address: AddressSchema.optional(),
    feeGroup: z.string().optional(),
    baseCurrency: CurrencyEnumSchema.optional(),
    occupation: OccupationTypeEnumSchema.optional(),
    sourceOfFunds: CorporateSourceOfFundTypeEnumSchema.optional(),
    sourceOfFundsOther: z.string().optional(),
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

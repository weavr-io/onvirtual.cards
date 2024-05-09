import { z } from 'zod'
import { IndustryTypeEnumSchema } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/IndustryTypeEnum'
import { CorporateSourceOfFundTypeEnumSchema } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CorporateSourceOfFundTypeEnum'
import { AddressSchema } from '~/plugins/weavr-multi/api/models/common/models/Address'
import { MobileSchema } from '~/plugins/weavr-multi/api/models/common/models/MobileModel'
import { CurrencyEnumSchema } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { DateSchema } from '~/plugins/weavr-multi/api/models/common/models/DateModel'

const UpdateCorporateRequestSchema = z.object({
    tag: z.string().optional(),
    industry: IndustryTypeEnumSchema.optional(),
    sourceOfFunds: CorporateSourceOfFundTypeEnumSchema.optional(),
    sourceOfFundsOther: z.string().optional(),
    companyBusinessAddress: AddressSchema.optional(),
    feeGroup: z.string().optional(),
    baseCurrency: CurrencyEnumSchema.optional(),
    name: z.string().optional(),
    surname: z.string().optional(),
    email: z.string().email().optional(),
    mobile: MobileSchema.optional(),
    dateOfBirth: DateSchema.optional(),
})

type UpdateCorporateRequest = z.infer<typeof UpdateCorporateRequestSchema>

const INITIAL_UPDATE_CORPORATE_REQUEST = {
    tag: undefined,
    industry: undefined,
    sourceOfFunds: undefined,
    sourceOfFundsOther: undefined,
    companyBusinessAddress: undefined,
    feeGroup: undefined,
    baseCurrency: undefined,
    name: undefined,
    surname: undefined,
    email: undefined,
    mobile: undefined,
    dateOfBirth: undefined,
} as unknown as UpdateCorporateRequest

export { UpdateCorporateRequestSchema, UpdateCorporateRequest, INITIAL_UPDATE_CORPORATE_REQUEST }

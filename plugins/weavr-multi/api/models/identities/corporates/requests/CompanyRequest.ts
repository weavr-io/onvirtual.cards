import { z } from 'zod'
import { CompanyTypeEnumSchema } from '../enums'
import { Address, AddressSchema } from '~/plugins/weavr-multi/api/models/common'
import { CompanyTypeEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CompanyTypeEnum'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'

export interface CompanyRequest {
    type: CompanyTypeEnum
    businessAddress?: Address
    name: string
    registrationNumber: string
    registrationCountry: string
}

const CompanyRequestSchema = z.object({
    type: CompanyTypeEnumSchema,
    businessAddress: AddressSchema.optional(),
    name: preprocessEmptyAsUndefined(z.string().max(100)),
    registrationNumber: preprocessEmptyAsUndefined(z.string().max(20)),
    registrationCountry: preprocessEmptyAsUndefined(z.string().max(2)),
})

type CompanyRequestType = z.infer<typeof CompanyRequestSchema>

const INITIAL_COMPANY_REQUEST = () => {
    return {
        type: null,
        businessAddress: undefined,
        name: undefined,
        registrationNumber: undefined,
        registrationCountry: null,
    } as unknown as CompanyRequestType
}

export { CompanyRequestSchema, CompanyRequestType, INITIAL_COMPANY_REQUEST }

import { z } from 'zod'
import { CompanyPositionEnumSchema } from '../enums'
import { AddressModel, AddressSchema } from '~/plugins/weavr-multi/api/models/common'
import { CompanyTypeEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CompanyTypeEnum'

export interface CompanyRequest {
    type: CompanyTypeEnum
    businessAddress?: AddressModel
    name: string
    registrationNumber: string
    registrationCountry: string
}

const CompanyRequestSchema = z.object({
    type: CompanyPositionEnumSchema,
    businessAddress: AddressSchema.optional(),
    name: z.string(),
    registrationNumber: z.string(),
    registrationCountry: z.string(),
})

type CompanyRequestType = z.infer<typeof CompanyRequestSchema>

const INITIAL_COMPANY_REQUEST = {
    type: undefined,
    businessAddress: undefined,
    name: undefined,
    registrationNumber: undefined,
    registrationCountry: undefined,
}

export { CompanyRequestSchema, CompanyRequestType, INITIAL_COMPANY_REQUEST }

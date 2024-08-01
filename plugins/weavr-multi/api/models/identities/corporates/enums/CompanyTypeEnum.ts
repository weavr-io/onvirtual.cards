import { z } from 'zod'

export enum CompanyTypeEnum {
    SOLE_TRADER = 'SOLE_TRADER',
    LLC = 'LLC',
    PUBLIC_LIMITED_COMPANY = 'PUBLIC_LIMITED_COMPANY',
    LIMITED_LIABILITY_PARTNERSHIP = 'LIMITED_LIABILITY_PARTNERSHIP',
    NON_PROFIT_ORGANISATION = 'NON_PROFIT_ORGANISATION',
}

const CompanyTypeEnumSchema = z.nativeEnum(CompanyTypeEnum)
type CompanyTypeEnumType = z.infer<typeof CompanyTypeEnumSchema>

export { CompanyTypeEnumSchema, type CompanyTypeEnumType }

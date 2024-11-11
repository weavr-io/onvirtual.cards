import { z } from 'zod'

export enum CompanyPositionEnum {
    DIRECTOR = 'DIRECTOR',
    AUTHORISED_REPRESENTATIVE = 'AUTHORISED_REPRESENTATIVE',
}

const CompanyPositionEnumSchema = z.nativeEnum(CompanyPositionEnum)
type CompanyPositionEnumType = z.infer<typeof CompanyPositionEnumSchema>

export { CompanyPositionEnumSchema, type CompanyPositionEnumType }

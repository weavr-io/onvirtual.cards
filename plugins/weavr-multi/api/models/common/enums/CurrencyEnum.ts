import { z } from 'zod'

export enum CurrencyEnum {
    EUR = 'EUR',
    GBP = 'GBP',
    USD = 'USD',
}

const CurrencyEnumSchema = z.nativeEnum(CurrencyEnum)
type CurrencyEnumType = z.infer<typeof CurrencyEnumSchema>

export { CurrencyEnumSchema, type CurrencyEnumType }

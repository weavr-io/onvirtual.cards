import { z } from 'zod'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'

export interface DateModel {
    year: number
    month: number
    day: number
}

const DateSchema = z.object({
    year: preprocessEmptyAsUndefined(z.number()),
    month: preprocessEmptyAsUndefined(z.number()),
    day: preprocessEmptyAsUndefined(z.number()),
})

type Date = z.infer<typeof DateSchema>

const INITIAL_DATE_REQUEST = () => {
    return {
        year: undefined,
        month: undefined,
        day: undefined,
    } as unknown as Date
}

export { DateSchema, Date, INITIAL_DATE_REQUEST }

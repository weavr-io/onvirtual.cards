import { z } from 'zod'

export interface DateModel {
    year: number
    month: number
    day: number
}

const DateSchema = z.object({
    year: z.number(),
    month: z.number(),
    day: z.number(),
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

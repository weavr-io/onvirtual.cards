import { z } from 'zod'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'

export interface MobileModel {
    countryCode: string
    number: string
}

const MobileSchema = z.object({
    countryCode: preprocessEmptyAsUndefined(z.string()),
    number: preprocessEmptyAsUndefined(z.string()),
})

type Mobile = z.infer<typeof MobileSchema>

const INITIAL_MOBILE_REQUEST = () => {
    return {
        countryCode: undefined,
        number: undefined,
    } as unknown as Mobile
}

export { MobileSchema, type Mobile, INITIAL_MOBILE_REQUEST }

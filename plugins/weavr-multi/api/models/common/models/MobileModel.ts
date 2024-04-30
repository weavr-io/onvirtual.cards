import { z } from 'zod'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'

export interface MobileModel {
    countryCode: string
    number: string
}

const MobileSchema = z.object({
    countryCode: preprocessEmptyAsUndefined(z.string()),
    mobile: preprocessEmptyAsUndefined(z.string()),
})

type Mobile = z.infer<typeof MobileSchema>

const INITIAL_MOBILE_REQUEST = {
    countryCode: undefined,
    mobile: undefined,
} as unknown as Mobile

export { MobileSchema, Mobile, INITIAL_MOBILE_REQUEST }

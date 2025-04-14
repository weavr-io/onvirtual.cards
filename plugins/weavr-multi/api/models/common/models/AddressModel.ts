import { z } from 'zod'
import { INVALID_FEEDBACK_CONST } from '~/local/const/InvalidFeedbackConst'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'

export interface AddressModel {
    addressLine1?: string
    addressLine2?: string
    city?: string
    postCode?: string
    state?: string
    country: string
}

const AddressSchema = z.object({
    addressLine1: preprocessEmptyAsUndefined(z.string().optional()),
    addressLine2: preprocessEmptyAsUndefined(z.string().optional()),
    city: preprocessEmptyAsUndefined(z.string().optional()),
    postCode: preprocessEmptyAsUndefined(z.string().optional()),
    state: preprocessEmptyAsUndefined(z.string().optional()),
    country: preprocessEmptyAsUndefined(
        z.string().max(2, { message: INVALID_FEEDBACK_CONST.maxLength2 }),
    ),
})

type AddressType = z.infer<typeof AddressSchema>

const INITIAL_ADDRESS = () => {
    return {
        addressLine1: undefined,
        addressLine2: undefined,
        city: undefined,
        postCode: undefined,
        state: undefined,
        country: null,
    } as unknown as AddressType
}

export { AddressSchema, type AddressType, INITIAL_ADDRESS }

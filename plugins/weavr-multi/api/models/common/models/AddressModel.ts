import { z } from 'zod'
import { INVALID_FEEDBACK_CONST } from '~/local/const/InvalidFeedbackConst'

export interface AddressModel {
    addressLine1?: string
    addressLine2?: string
    city?: string
    postCode?: string
    state?: string
    country: string
}

const AddressSchema = z.object({
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    postCode: z.string().optional(),
    state: z.string().optional(),
    country: z.string().max(2, { message: INVALID_FEEDBACK_CONST.maxLength2 }),
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

export { AddressSchema, AddressType, INITIAL_ADDRESS }

import { z } from 'zod'

const AddressSchema = z.object({
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    city: z.string(),
    postCode: z.string(),
    state: z.string().optional(),
    country: z.string().max(2),
})

type Address = z.infer<typeof AddressSchema>

const INITIAL_ADDRESS = () => {
    return {
        addressLine1: undefined,
        addressLine2: undefined,
        city: undefined,
        postCode: undefined,
        state: undefined,
        country: null,
    } as unknown as Address
}

export { AddressSchema, Address, INITIAL_ADDRESS }

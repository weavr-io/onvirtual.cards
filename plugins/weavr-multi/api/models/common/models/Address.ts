import { z } from 'zod'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'

const AddressSchema = z.object({
    addressLine1: preprocessEmptyAsUndefined(z.string()),
    addressLine2: preprocessEmptyAsUndefined(z.string()),
    city: preprocessEmptyAsUndefined(z.string()),
    postCode: preprocessEmptyAsUndefined(
        z
            .string()
            .max(10, { message: 'Postcode must be at most 10 characters long.' })
            .regex(/^[A-Za-z0-9 -]*$/, {
                message: 'Postcode may only contain letters, numbers, spaces, and hyphens.',
            }),
    ),
    state: preprocessEmptyAsUndefined(z.string().optional()),
    country: preprocessEmptyAsUndefined(z.string().max(2)),
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

export { AddressSchema, type Address, INITIAL_ADDRESS }

import { z } from 'zod'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'

const AddressSchema = z.object({
    addressLine1: preprocessEmptyAsUndefined(z.string()),
    addressLine2: preprocessEmptyAsUndefined(z.string()),
    city: preprocessEmptyAsUndefined(z.string()),
    postCode: preprocessEmptyAsUndefined(z.string()),
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

export { AddressSchema, Address, INITIAL_ADDRESS }

import { z } from 'zod'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'

const DeliveryAddressSchema = z.object({
    name: preprocessEmptyAsUndefined(z.string()),
    surname: preprocessEmptyAsUndefined(z.string()),
    addressLine1: preprocessEmptyAsUndefined(z.string()),
    addressLine2: preprocessEmptyAsUndefined(z.string().optional()),
    city: preprocessEmptyAsUndefined(z.string()),
    postCode: preprocessEmptyAsUndefined(z.string()),
    state: preprocessEmptyAsUndefined(z.string().optional()),
    country: preprocessEmptyAsUndefined(z.string()),
    contactNumber: preprocessEmptyAsUndefined(z.string().optional()),
})

type DeliveryAddress = z.infer<typeof DeliveryAddressSchema>

const INITIAL_DELIVERY_ADDRESS = () => {
    return {
        name: undefined,
        surname: undefined,
        addressLine1: undefined,
        addressLine2: undefined,
        city: undefined,
        postCode: undefined,
        state: undefined,
        country: undefined,
        contactNumber: undefined,
    } as unknown as DeliveryAddress
}

export { INITIAL_DELIVERY_ADDRESS, type DeliveryAddress, DeliveryAddressSchema }

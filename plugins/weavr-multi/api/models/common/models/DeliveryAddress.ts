import { z } from 'zod'

const DeliveryAddressSchema = z.object({
    name: z.string(),
    surname: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    city: z.string(),
    postCode: z.string(),
    state: z.string().optional(),
    country: z.string(),
    contactNumber: z.string().optional(),
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

export { INITIAL_DELIVERY_ADDRESS, DeliveryAddress, DeliveryAddressSchema }

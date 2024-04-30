import { z } from 'zod'

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
    country: z.string(),
})

type AddressType = z.infer<typeof AddressSchema>

const INITIAL_ADDRESS = {
    addressLine1: undefined,
    addressLine2: undefined,
    city: undefined,
    postCode: undefined,
    state: undefined,
    country: undefined,
} as unknown as AddressType

export { AddressSchema, AddressType, INITIAL_ADDRESS }

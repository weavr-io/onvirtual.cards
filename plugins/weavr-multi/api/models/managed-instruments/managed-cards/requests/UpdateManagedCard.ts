import { z } from 'zod'
import { AddressSchema, DeliveryAddressSchema } from '~/plugins/weavr-multi/api/models/common'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'

const ManagedCardUpdateSchema = z
    .object({
        tag: preprocessEmptyAsUndefined(z.string()),
        friendlyName: preprocessEmptyAsUndefined(z.string().max(50)),
        nameOnCard: preprocessEmptyAsUndefined(z.string().max(27)),
        nameOnCardLine2: preprocessEmptyAsUndefined(z.string().max(27)),
        cardholderMobileNumber: preprocessEmptyAsUndefined(z.string().min(5).max(20)),
        billingAddress: AddressSchema,
        deliveryAddress: DeliveryAddressSchema,
        deliveryMethod: preprocessEmptyAsUndefined(z.string()),
    })
    .partial()

type UpdateManagedCard = z.infer<typeof ManagedCardUpdateSchema>

const INITIAL_MC_UPDATE_REQUEST = () => {
    return {
        friendlyName: undefined,
    } as unknown as UpdateManagedCard
}

export { UpdateManagedCard, ManagedCardUpdateSchema, INITIAL_MC_UPDATE_REQUEST }

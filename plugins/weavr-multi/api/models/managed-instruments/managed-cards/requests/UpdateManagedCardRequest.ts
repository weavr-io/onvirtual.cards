import { z } from 'zod'
import { AddressModel } from '~/plugins/weavr-multi/api/models/common/AddressModel'
import { DeliveryAddressModel } from '~/plugins/weavr-multi/api/models/common/DeliveryAddressModel'
import { PhysicalCardDeliveryMethodEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/enums/PhysicalCardDeliveryMethodEnum'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'
import { INVALID_FEEDBACK_CONST } from '~/local/const/InvalidFeedbackConst'

export interface UpdateManagedCardRequest {
    tag?: string
    friendlyName?: string
    cardholderMobileNumber?: string
    billingAddress?: AddressModel
    deliveryAddress?: DeliveryAddressModel
    deliveryMethod?: PhysicalCardDeliveryMethodEnum
}

const ManagedCardUpdateSchema = z.object({
    friendlyName: preprocessEmptyAsUndefined(
        z.string().min(1).max(50, { message: INVALID_FEEDBACK_CONST.maxLength50 }),
    ),
    cardholderMobileNumber: preprocessEmptyAsUndefined(z.string()),
})

type UpdateManagedCard = z.infer<typeof ManagedCardUpdateSchema>

const INITIAL_MC_UPDATE_REQUEST = {
    friendlyName: undefined,
} as unknown as UpdateManagedCard

export { UpdateManagedCard, ManagedCardUpdateSchema, INITIAL_MC_UPDATE_REQUEST }

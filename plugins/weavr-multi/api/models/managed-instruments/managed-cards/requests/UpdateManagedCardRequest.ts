import { AddressModel } from '~/plugins/weavr-multi/api/models/common/AddressModel'
import { DeliveryAddressModel } from '~/plugins/weavr-multi/api/models/common/DeliveryAddressModel'
import { PhysicalCardDeliveryMethodEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/enums/PhysicalCardDeliveryMethodEnum'

export interface UpdateManagedCardRequest {
    tag?: string
    friendlyName?: string
    cardholderMobileNumber?: string
    billingAddress?: AddressModel
    deliveryAddress?: DeliveryAddressModel
    deliveryMethod?: PhysicalCardDeliveryMethodEnum
}

import { PhysicalCardDeliveryMethodEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/enums/PhysicalCardDeliveryMethodEnum'
import { DeliveryAddressModel } from '~/plugins/weavr-multi/api/models/common/models/DeliveryAddressModel'
import { SensitivePinModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/models/SensitivePinModel'

export interface UpgradeToPhysicalManagedCardRequest {
    productReference?: string
    carrierType?: string
    deliveryMethod?: PhysicalCardDeliveryMethodEnum
    deliveryAddress: DeliveryAddressModel
    activationCode: string
    pin: SensitivePinModel
}

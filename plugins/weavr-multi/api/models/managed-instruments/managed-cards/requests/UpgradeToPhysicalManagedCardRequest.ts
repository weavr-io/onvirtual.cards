import { PhysicalCardDeliveryMethodEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/enums/PhysicalCardDeliveryMethodEnum'
import { DeliveryAddress } from '~/plugins/weavr-multi/api/models/common/models/DeliveryAddress'
import { SensitivePinModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/models/SensitivePinModel'

export interface UpgradeToPhysicalManagedCardRequest {
    productReference?: string
    carrierType?: string
    deliveryMethod?: PhysicalCardDeliveryMethodEnum
    deliveryAddress: DeliveryAddress
    activationCode: string
    pin: SensitivePinModel
}

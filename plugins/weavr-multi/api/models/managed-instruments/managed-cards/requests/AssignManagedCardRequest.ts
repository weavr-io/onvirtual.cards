import { Address } from '~/plugins/weavr-multi/api/models/common/models/Address'

export interface AssignManagedCardRequest {
    externalReference: string
    activationCode: string
    friendlyName: string
    nameOnCard: string
    billingAddress: Address
    cardholderMobileNumber?: string
}

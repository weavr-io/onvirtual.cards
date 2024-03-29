import { AddressModel } from '~/plugins/weavr-multi/api/models/common/AddressModel'

export interface AssignManagedCardRequest {
    externalReference: string
    activationCode: string
    friendlyName: string
    nameOnCard: string
    billingAddress: AddressModel
    cardholderMobileNumber?: string
}

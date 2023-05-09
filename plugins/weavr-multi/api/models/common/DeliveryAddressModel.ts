export interface DeliveryAddressModel {
    name: string
    surname: string
    addressLine1: string
    addressLine2?: string
    city: string
    postCode: string
    state?: string
    country: string
}

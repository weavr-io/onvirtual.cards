export interface CreateConsumerRequest {
  profileId: any
  tag?: string
  name: string
  surname: string
  email: string
  credentialCode?: string
  mobileCountryCode: string
  mobileNumber: string
  baseCurrency?: string
  dateOfBirth?: {
    year?: number
    month?: number
    day?: number
  } | null
  address?: {
    addressLine1: string
    addressLine2?: string
    city: string
    country: string
    postCode: string
    state?: string
  }
  feeGroup?: string
}

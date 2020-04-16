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
}

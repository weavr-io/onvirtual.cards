export interface CreateConsumerRequest {
  profileId: any
  tag?: string
  name: string
  surname: string
  email: string
  credentialCode: string
  secretType: {
    firstSecretType: string
    secondSecretType?: string
  }
  mobileCountryCode: string
  mobileNumber: string
}

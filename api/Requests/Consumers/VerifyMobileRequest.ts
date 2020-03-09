export interface VerifyMobileRequest {
  consumerId: number
  request: {
    mobileNumber: string
    mobileCountryCode: string
    nonce: string
  }
}

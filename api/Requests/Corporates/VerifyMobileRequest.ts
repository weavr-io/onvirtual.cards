export interface VerifyMobileRequest {
  corporateId: number
  request: {
    mobileNumber: string
    mobileCountryCode: string
    nonce: string
  }
}

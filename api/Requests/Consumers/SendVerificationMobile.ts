export interface SendVerificationMobile {
  consumerId: number
  request: {
    mobileNumber: string
    mobileCountryCode: string
  }
}

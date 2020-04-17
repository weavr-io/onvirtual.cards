export interface SendVerificationMobile {
  corporateId: number
  request: {
    mobileNumber: string
    mobileCountryCode: string
  }
}

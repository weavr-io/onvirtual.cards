export interface SendVerificationEmail {
  consumerId: number
  request: {
    emailAddress: string
  }
}

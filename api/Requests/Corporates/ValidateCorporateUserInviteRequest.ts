export interface ValidateCorporateUserInviteRequest {
  id: number
  body: {
    emailAddress: string
    nonce: string
  }
}

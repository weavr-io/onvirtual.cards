export interface ConsumeCorporateUserInviteRequest {
  id: number
  body: {
    emailAddress: string
    nonce: string
    password: {
      value: string
    }
  }
}

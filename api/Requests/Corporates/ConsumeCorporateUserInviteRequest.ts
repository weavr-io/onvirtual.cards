export interface ConsumeCorporateUserInviteRequest {
  id: string
  body: {
    identityId: {
      type: string
      id: string
    }
    userId: string
    nonce: string
    password: {
      value: string
    }
  }
}

export interface ConsumeCorporateUserInviteRequest {
  id: number
  body: {
    identityId: {
      type: string
      id: number
    }
    userId: number
    nonce: string
    password: {
      value: string
    }
  }
}

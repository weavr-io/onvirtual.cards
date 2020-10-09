export interface ValidateCorporateUserInviteRequest {
  id: string
  inviteId: string
  body: {
    nonce: string
  }
}

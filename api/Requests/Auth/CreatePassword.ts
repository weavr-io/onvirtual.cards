export interface CreatePassword {
  id: number
  request: {
    credentialType: string
    identityId: number
    password: {
      value: string
    }
  }
}

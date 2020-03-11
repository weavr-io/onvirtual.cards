export interface ValidatePasswordRequest {
  identityProfileId: string
  credentialType: string
  password: {
    value: string
  }
}

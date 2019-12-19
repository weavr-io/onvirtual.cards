export interface LostPasswordContinueRequest {
  email: string
  nonce: string
  password: {
    value?: string
  }
}

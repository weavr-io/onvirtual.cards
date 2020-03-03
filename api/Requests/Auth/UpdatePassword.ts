export interface UpdatePassword {
  id: number
  request: {
    password: {
      value: string
    }
    oldPassword: {
      value: string
    }
    confirmPassword?: {
      value: string
    }
  }
}

export interface UpdateManagedCardRequest {
  id: string
  body: {
    tag?: string
    friendlyName: string
    cardholderMobileNumber?: string
    formattedMobileNumber?: string
  }
}

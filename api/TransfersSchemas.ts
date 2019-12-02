export module TransfersSchemas {
  export interface CreateTransferRequest {
    profileId: any
    tag?: string
    source: {
      type: string
      id: string | null
    }
    destination: {
      type: string
      id: string | null
    }
    destinationAmount: {
      currency: string
      amount?: number
    }
  }
}

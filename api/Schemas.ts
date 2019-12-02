export module Schemas {
  export enum OrderType {
    ASC = 'ASC',
    DESC = 'DESC'
  }

  export interface TypeId {
    type: string
    id: number
  }

  export interface LoginRequest {
    programmeId: string
    code: string
    password: string
  }

  export interface verifyEmailRequest {
    corporateId: any
    request: {
      emailAddress: string
      nonce: string
    }
  }

  export interface CurrencyAmount {
    currency: string
    amount: number
  }

  export interface ScaledAmount {
    value: number
    scale: number
  }

  export interface PagingRequest {
    count?: boolean
    offset?: number
    limit?: number
  }
}

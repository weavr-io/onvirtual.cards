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

  export interface LoginResult {
    token?: string
    programmeId?: number
    credential?: TypeId
    identity?: TypeId
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
    offset?: number
    limit?: number
  }
}

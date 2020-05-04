import { ConsumerKycStatus } from './ConsumerKycStatus'

export interface Consumer {
  id: {
    type: string
    id: number
  }
  profileId: number
  tag?: string
  name: string
  surname: string
  email: string
  active?: boolean
  creationTimestamp: number
  mobileCountryCode: string
  mobileNumber: string
  kyc?: ConsumerKycStatus
  defaultCurrency?: string
  dateOfBirth?: {
    year?: number
    month?: number
    day?: number
  }
  address?: {
    addressLine1: string
    addressLine2?: string
    city: string
    country: string
    postCode: string
    state?: string
  }
  feeGroup?: string
}

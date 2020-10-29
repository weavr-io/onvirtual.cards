import { KYBState } from '~/api/Enums/KYBState'

export interface CorporateKybStatus {
  rootEmailVerified: boolean
  rootMobileVerified: boolean
  fullCompanyChecksVerified: KYBState
  enhancedCompanyChecksVerified: KYBState
  allowedLimit: {
    currency: string
    amount: number
  }
  remainingLimit: {
    currency: string
    amount: number
  }
}

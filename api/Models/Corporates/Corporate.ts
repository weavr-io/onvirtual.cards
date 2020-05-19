import { KYBState } from '~/api/Enums/KYBState'
import { Schemas } from '~/api/Schemas'
import { CompanyType } from '~/api/Enums/Corporates/CompanyType'
import CurrencyAmount = Schemas.CurrencyAmount

export interface Corporate {
  id: {
    type: string
    id: number
  }
  profileId: string
  tag?: string
  name: string
  companyType: CompanyType
  supportEmail: string
  active?: boolean
  creationTimestamp: number
  verifications?: string[]
  companyRegistrationNumber: string
  companyRegistrationAddress: string
  companyBusinessAddress: string
  registrationCountry: string
  companyRegistrationDate: number
  acceptedTerms: boolean
  kyb?: {
    rootEmailVerified: boolean
    rootMobileVerified: boolean
    basicCompanyChecksVerified: KYBState
    fullCompanyChecksVerified: KYBState
    enhancedCompanyChecksVerified: KYBState
    allowedLimit: CurrencyAmount
    remainingLimit: CurrencyAmount
  }
  baseCurrency?: string
  feeGroup?: string
  incorporatedOn?: {
    year?: number
    month?: number
    day?: number
  }
}

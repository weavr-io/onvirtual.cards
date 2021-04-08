import { CompanyType } from '~/api/Enums/Corporates/CompanyType'
import { IndustryOccupation } from '~/api/Enums/Corporates/IndustryOccupation'
import { SourceOfFunds } from '~/api/Enums/Corporates/SourceOfFunds'
import { BooleanString } from '~/api/Generic/BooleanString'

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
  registrationCountry: string
  acceptedTerms: BooleanString
  baseCurrency?: string
  feeGroup?: string
  incorporatedOn?: {
    year?: number
    month?: number
    day?: number
  }
  industry: IndustryOccupation
  sourceOfFunds?: SourceOfFunds
  sourceOfFundsOther?: string
  registrationAddress?: {
    addressLine1?: string
    addressLine2?: string
    city?: string
    country?: string
    postCode?: string
    state?: string
  }
  businessAddress?: {
    addressLine1?: string
    addressLine2?: string
    city?: string
    country?: string
    postCode?: string
    state?: string
  }
}

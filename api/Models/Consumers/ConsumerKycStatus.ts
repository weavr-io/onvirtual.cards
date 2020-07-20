import { IsPep } from '~/api/Enums/Consumers/IsPep'
import { IsSanctioned } from '~/api/Enums/Consumers/IsSanctioned'
import { FullDueDiligence } from '~/api/Enums/Consumers/FullDueDiligence'
import { Schemas } from '~/api/Schemas'
import CurrencyAmount = Schemas.CurrencyAmount

export interface ConsumerKycStatus {
  emailVerified?: boolean
  mobileVerified?: boolean
  pep?: IsPep
  sanctioned?: IsSanctioned
  fullDueDiligence?: FullDueDiligence
  enhancedDueDiligence?: FullDueDiligence
  allowedLimit?: CurrencyAmount
  remainingLimit?: CurrencyAmount
}

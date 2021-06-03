import { SourceOfFunds } from '~/api/Enums/Consumers/SourceOfFunds'
import { IndustryOccupation } from '~/api/Enums/Consumers/IndustryOccupation'
import { Address } from '~/api/Models/Common/Address'
import { BooleanString } from '~/api/Generic/BooleanString'

export interface CreateConsumerRequest {
  profileId: any
  tag?: string
  name: string
  surname: string
  email: string
  mobileCountryCode: string
  mobileNumber: string
  baseCurrency?: string
  dateOfBirth?: {
    year?: number
    month?: number
    day?: number
  } | null
  address?: Address
  feeGroup?: string
  occupation?: IndustryOccupation | null
  sourceOfFunds: SourceOfFunds | null
  sourceOfFundsOther?: string
  ipAddress?: string
  acceptedTerms?: BooleanString
}

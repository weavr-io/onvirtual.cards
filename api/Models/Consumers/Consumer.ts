import { ConsumerKycStatus } from './ConsumerKycStatus'
import { IndustryOccupation } from '~/api/Enums/Consumers/IndustryOccupation'
import { SourceOfFunds } from '~/api/Enums/Consumers/SourceOfFunds'
import { Address } from '~/api/Models/Common/Address'

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
  baseCurrency?: string
  dateOfBirth?: {
    year?: number
    month?: number
    day?: number
  }
  address?: Address
  feeGroup?: string
  occupation?: IndustryOccupation
  sourceOfFunds?: SourceOfFunds
  sourceOfFundsOther?: string
}

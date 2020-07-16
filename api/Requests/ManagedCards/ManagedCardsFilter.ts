import { Schemas } from '~/api/Schemas'
import { CardBrand, CardType } from '~/api/Constants/Card'
import PagingRequest = Schemas.PagingRequest
import TypeId = Schemas.TypeId
import { NullableBoolean } from '~/api/Generic/NullableBoolean'

export interface ManagedCardsFilter {
  paging?: PagingRequest
  profileId?: number
  owner?: TypeId
  friendlyName?: string
  active?: NullableBoolean
  currency?: string
  type?: CardType
  cardBrand?: CardBrand
  cardNumberFirstSix?: string
  cardNumberLastFour?: string
  expiryMmyy?: string
  createdFrom?: number
  createdTo?: number
  hasPending?: true
  tag?: string
}

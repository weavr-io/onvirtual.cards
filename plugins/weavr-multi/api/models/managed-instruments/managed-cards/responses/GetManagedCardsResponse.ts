import { ManagedCardModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/models/ManagedCardModel'

export interface GetManagedCardsResponse {
  cards?: ManagedCardModel
  count?: number
  responseCount: number
}

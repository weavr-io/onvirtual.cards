import type { PaginatedManagedCardsResponse } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/responses/PaginatedManagedCardsResponse'
import type { ManagedCardModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/models/ManagedCardModel'
import type { StatementResponseModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/responses/StatementResponseModel'

export interface Cards {
    isLoading: boolean
    cards: PaginatedManagedCardsResponse | null
    managedCard: ManagedCardModel | null
    statements: StatementResponseModel | null
    filteredStatement: Record<string, unknown> | null
}

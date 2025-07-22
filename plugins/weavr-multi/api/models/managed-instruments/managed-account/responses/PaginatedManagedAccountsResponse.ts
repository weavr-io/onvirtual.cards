import type { ManagedAccountModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/ManagedAccountModel'
import type { PaginatedResponse } from '~/plugins/weavr-multi/api/models/common/models/PaginatedResponse'

export interface PaginatedManagedAccountsResponse extends PaginatedResponse {
    accounts?: ManagedAccountModel[]
}

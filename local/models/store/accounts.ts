import type { PaginatedManagedAccountsResponse } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/responses/PaginatedManagedAccountsResponse'
import type { ManagedAccountModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/ManagedAccountModel'
import type { StatementResponseModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/responses/StatementResponseModel'
import type { ManagedAccountIBANModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/ManagedAccountIBANModel'

export interface Accounts {
    accounts: PaginatedManagedAccountsResponse | null
    account: ManagedAccountModel | null
    statements: StatementResponseModel | null
    ibanDetails: ManagedAccountIBANModel | null
}

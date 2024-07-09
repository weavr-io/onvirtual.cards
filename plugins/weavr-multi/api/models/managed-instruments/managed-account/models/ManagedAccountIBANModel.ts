import { ManagedAccountIBANStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/enums/ManagedAccountIBANStateEnum'
import type { BankAccountDetailsModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/BankAccountDetailsModel'

export interface ManagedAccountIBANModel {
    state: ManagedAccountIBANStateEnum
    bankAccountDetails: BankAccountDetailsModel[]
}

import { IDModel } from '../../../common/IDModel'
import { TransactionTypeEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/enums/TransactionTypeEnum'

export interface TransactionIdModel {
    type: TransactionTypeEnum
    id: IDModel
}

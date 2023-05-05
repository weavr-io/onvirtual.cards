import { IDModel } from '../../../common/IDModel'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'

export interface CreateManagedAccountRequest {
    profileId: IDModel
    friendlyName: string
    currency: CurrencyEnum
    tag?: string
}

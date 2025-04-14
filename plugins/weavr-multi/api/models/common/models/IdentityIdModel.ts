import type { IDModel } from './IDModel'
import { IdentityTypeEnum } from '~/plugins/weavr-multi/api/models/common/enums/IdentityTypeEnum'

export interface IdentityIdModel {
    type: IdentityTypeEnum
    id: IDModel
}
